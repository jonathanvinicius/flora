import { Test, TestingModule } from '@nestjs/testing';
import { GetWordDefinitionsUseCase } from '../get-word-definitions.usecase';
import { ApiClientService } from '@app/libs/request/src';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import {
  createApiClientServiceMock,
  makeAxiosResponse,
} from '@app/libs/request/src/mock';
import { GetDefinitionWordResponse } from '../../responses/get-definition-word.response';

describe('GetWordDefinitionsUseCase', () => {
  let moduleRef: TestingModule;
  let useCase: GetWordDefinitionsUseCase;

  const apiMock = createApiClientServiceMock();

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        GetWordDefinitionsUseCase,
        { provide: ApiClientService, useValue: apiMock },
      ],
    }).compile();

    useCase = moduleRef.get(GetWordDefinitionsUseCase);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('returns mapped entry when API returns data', async () => {
    const apiEntry = {
      word: 'hungry',
      phonetics: [{ text: '/ˈhʌŋ.ɡri/' }],
      meanings: [
        {
          partOfSpeech: 'adjective',
          definitions: [{ definition: 'Feeling the need for food.' }],
        },
      ],
      license: {
        name: 'CC BY-SA 3.0',
        url: 'https://creativecommons.org/licenses/by-sa/3.0',
      },
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    };

    apiMock.get.mockResolvedValueOnce(
      makeAxiosResponse<GetDefinitionWordResponse>([apiEntry]),
    );

    const result = await useCase.execute({ word: 'hungry' });

    expect(result).toEqual({
      name: 'hungry',
      phonetics: apiEntry.phonetics,
      meanings: apiEntry.meanings,
      license: apiEntry.license,
      sourceUrls: apiEntry.sourceUrls,
    });
    expect(apiMock.get).toHaveBeenCalledWith('entries/en/hungry');
  });

  it('throws NotFoundException when API returns 404', async () => {
    apiMock.get.mockRejectedValueOnce({ response: { status: 404 } });
    await expect(useCase.execute({ word: 'missing' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws HttpException(FAILED_DEPENDENCY) on other errors', async () => {
    apiMock.get.mockRejectedValueOnce({ response: { status: 500 } });
    try {
      await useCase.execute({ word: 'boom' });
      fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getStatus()).toBe(
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  });
});
