import { ServerRMQ } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class RabbitMqCustomServer extends ServerRMQ {
  readonly logger = new Logger(RabbitMqCustomServer.name);

  public constructor({
    uri,
    queue,
    exchange,
    queueArguments,
    prefetchCount,
  }: {
    uri: string;
    queue: string;
    exchange: string;
    queueArguments?: Record<string, any>;
    prefetchCount?: number;
  }) {
    super({
      urls: [uri],
      noAck: false,
      queue: queue,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
      persistent: true,
      prefetchCount: prefetchCount ?? 1,
      queueOptions: RabbitMqCustomServer.getDefaultQueueOptions(
        queue,
        exchange,
        queueArguments,
      ),
    });
  }

  public async setupChannel(channel: any, callback: () => void): Promise<void> {
    this.logger.debug('Setup Channel RabbitMQ');
    await super.setupChannel(channel, callback);
    this.logger.debug('Channel RabbitMQ successfully set up');

    channel.connection.on('error', (err: any) => {
      this.handleConnectionError(err);
    });

    channel.on('error', (err: any) => {
      this.handleChannelError(err);
    });

    channel.connection.on('close', (err: any) => {
      this.handleConnectionClose(err);
    });
  }

  private handleConnectionError(err: any): void {
    this.logger.error(
      `Erro de conexão RabbitMQ: ${this.getDetailedErrorMessage(err)}`,
    );
    this.logger.debug(`Detalhes completos do erro de conexão:`, err);
  }

  private handleChannelError(err: any): void {
    this.logger.error(
      `Erro de canal RabbitMQ: ${this.getDetailedErrorMessage(err)}`,
    );
    this.logger.debug(`Detalhes completos do erro de canal:`, err);
  }

  private handleConnectionClose(err: any): void {
    if (err) {
      this.logger.error(
        `Conexão RabbitMQ fechada com erro: ${this.getDetailedErrorMessage(err)}`,
      );
    } else {
      this.logger.warn(`Conexão RabbitMQ fechada`);
    }
  }

  private getDetailedErrorMessage(err: any): string {
    if (!err) return 'Erro desconhecido';

    const errorMessages: Record<number, string> = {
      320: 'CONNECTION_FORCED - Conexão forçadamente fechada pelo broker',
      501: 'FRAME_ERROR - Frame inválido recebido',
      302: 'INVALID_PATH - Caminho virtual inválido',
      402: 'ACCESS_REFUSED - Acesso recusado',
      403: 'NOT_ALLOWED - Operação não permitida',
      404: 'NOT_FOUND - Entidade não encontrada',
      405: 'RESOURCE_LOCKED - Recurso bloqueado',
      406: 'PRECONDITION_FAILED - Pré-condição falhou',
      311: 'CHANNEL_ERROR - Erro no canal',
      503: 'SYNTAX_ERROR - Erro de sintaxe no comando',
      504: 'COMMAND_INVALID - Comando inválido',
      530: 'NOT_IMPLEMENTED - Funcionalidade não implementada',
      541: 'INTERNAL_ERROR - Erro interno do servidor',
    };

    let detailedMessage = '';

    if (err.code && errorMessages[err.code]) {
      detailedMessage += `${errorMessages[err.code]} (Código: ${err.code})`;
    } else if (err.code) {
      detailedMessage += `Código de erro: ${err.code}`;
    }

    if (err.message) {
      detailedMessage += detailedMessage ? ` - ${err.message}` : err.message;
    }

    return detailedMessage || 'Erro não especificado';
  }

  private async parseMessage(message: Record<string, any>, channel: any) {
    try {
      return JSON.parse(message.content.toString());
    } catch (error) {
      channel.nack(message, false, false);
      return null;
    }
  }

  private static getDefaultQueueOptions(
    queueName: string,
    exchangeName: string,
    queueArguments?: Record<string, any>,
  ) {
    const queue =
      queueName === process.env.RABBITMQ_QUEUE_WORD_USER_HISTORY
        ? `${queueName}.dlq`
        : `${queueName.replace('.queue', '')}.dlq`;
    return {
      durable: true,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        enableHeartBeat: true,
        enableReadyCheck: true,
        reconnectTimeInSeconds: 5,
      },
      persistent: true,
      noAssert: false,
      arguments: queueArguments
        ? queueArguments
        : {
            'x-dead-letter-exchange': `${exchangeName}.dlx`,
            'x-dead-letter-routing-key': queue,
          },
    };
  }

  public async handleMessage(
    message: Record<string, any>,
    channel: any,
  ): Promise<void> {
    const packet = await this.parseMessage(message, channel);
    if (!packet) return;

    const { pattern } = packet;
    const handler = this.messageHandlers.get(pattern);

    if (!handler) {
      const originalPattern = `${pattern}`;
      packet.pattern = '#';
      packet.data = {
        ...packet.data,
        originalPattern: originalPattern,
      };
      message.content = Buffer.from(JSON.stringify(packet));
    }

    return super.handleMessage(message, channel);
  }
}
