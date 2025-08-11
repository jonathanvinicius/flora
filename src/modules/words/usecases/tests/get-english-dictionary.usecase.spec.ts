import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '@app/infra/config/config.mock';
import { GetEnglishDictionaryUseCase } from '../get-english-dictionary.usecase';

describe('GetEnglishDictionaryUseCase', () => {
  let useCase: GetEnglishDictionaryUseCase;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...ConfigMock],
      providers: [GetEnglishDictionaryUseCase],
    }).compile();

    useCase = module.get<GetEnglishDictionaryUseCase>(
      GetEnglishDictionaryUseCase,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a string', async () => {
    const result = await useCase.execute();

    expect(result).toBeDefined();
    expect(result.message).toBe('English Dictionary');
  });
});
