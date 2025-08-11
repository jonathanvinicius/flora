import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqService } from './rabbitmq.service';
import {
  MockChannel,
  MockMessage,
  MockRmqContext,
} from './__mocks__/rabbit-service.mock';
import { AckErrors } from '@app/shared';

describe('RabbitMqService', () => {
  let service: RabbitMqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitMqService],
    }).compile();

    service = module.get(RabbitMqService);

    jest.spyOn(service['logger'], 'log').mockImplementation(() => {});
    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});

    jest.clearAllMocks();
  });

  it('deve capturar e registrar error', async () => {
    const brokenContext = {
      getMessage: () => {
        throw new Error('getMessage failed');
      },
      getPattern: () => 'test-pattern',
    };

    const loggerSpy = jest.spyOn(service['logger'], 'error');

    const result = await service.saveMessage({
      context: brokenContext as any,
      key: 'key-123',
      message: 'mensagem de erro',
      error: new Error('error para fallback'),
    });
    expect(loggerSpy).toHaveBeenCalledWith(
      'saveMessage: Error: getMessage failed',
    );
    expect(result).toBeUndefined();
  });

  it('deve chamar ack e processar mensagem com carga payload válido', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const callback = jest.fn();

    await service.processMessage(
      MockRmqContext as any,
      { foo: 'bar' },
      handler,
      'testMethod',
      callback,
    );

    expect(handler).toHaveBeenCalledWith({ foo: 'bar' });
    expect(callback).toHaveBeenCalled();
    expect(MockChannel.ack).toHaveBeenCalledWith(MockMessage);
  });

  it('deve confirmar a mensagem e ignorar quando o payload for nulo', async () => {
    await service.processMessage(
      MockRmqContext as any,
      null,
      jest.fn(),
      'testMethod',
    );

    expect(MockChannel.ack).toHaveBeenCalledWith(MockMessage);
  });
  it('deve registrar erro e lançar exceção', async () => {
    const handler = jest.fn().mockRejectedValue(new Error('handler failed'));
    const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

    await expect(
      service.processMessage(
        MockRmqContext as any,
        { foo: 'bar' },
        handler,
        'testMethod',
      ),
    ).rejects.toThrow('handler failed');

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'processMessage: Error: handler failed',
    );
  });

  it('deve reenviar mensagem para a fila se o número de tentativas for menor que o limite', async () => {
    const retryParams = { retryLimit: 3 };
    await service.retryMessage(MockRmqContext as any, retryParams);

    expect(MockChannel.ack).toHaveBeenCalled();
    expect(MockChannel.sendToQueue).toHaveBeenCalledWith(
      'test_queue',
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-retries': expect.any(Number),
        }),
      }),
    );
  });

  it('deve mover a mensagem para a DLQ quando o número de tentativas exceder o limite', async () => {
    MockMessage.properties.headers['x-retries'] = 4;

    const retryParams = { retryLimit: 3 };
    await service.retryMessage(MockRmqContext as any, retryParams);

    expect(MockChannel.nack).toHaveBeenCalledWith(MockMessage, false, false);
  });

  it('deve confirmar a mensagem (ack) quando o erro for conhecido em AckErrors', async () => {
    const error = new Error(AckErrors[0]);
    const result = service.handleError({
      context: MockRmqContext as any,
      error,
      method: 'handleErrorMethod',
    });

    expect(MockChannel.ack).toHaveBeenCalledWith(MockMessage);
    expect(result).toBe(error);
  });

  it('deve rejeitar a mensagem (nack) e retornar true quando a operação for bem-sucedida', async () => {
    const loggerLogSpy = jest.spyOn(service['logger'], 'log');

    const result = service.moveMessageToDLQ(MockRmqContext as any);

    expect(MockChannel.nack).toHaveBeenCalledWith(MockMessage, false, false);
    expect(loggerLogSpy).toHaveBeenCalledWith(
      `[AMQP] Moving message test_queue=>test-pattern to DLQ`,
    );
    expect(result).toBe(true);
  });

  it('deve registrar erro e retornar false se ocorrer falha ao mover a mensagem para DLQ', async () => {
    const brokenContext = {
      getMessage: () => {
        throw new Error('broken context');
      },
    } as any;

    const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

    const result = service.moveMessageToDLQ(brokenContext);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'moveMessageToDLQ: Error: broken context',
    );
    expect(result).toBe(false);
  });
});
