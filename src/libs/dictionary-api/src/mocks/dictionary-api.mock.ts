import { IDictionaryApiService } from '../dictionary-api.service.interface';
import { DictionaryEntryMapper } from '../responses/get-definition-word.response';

export const makeDictionaryEntryMock = (
  word: string,
): DictionaryEntryMapper => ({
  name: word,
  phonetics: [
    {
      text: `/phonetic-${word}/`,
      audio: `https://audio.example/${word}.mp3`,
      sourceUrl: `https://source.example/${word}`,
      license: {
        name: 'CC BY-SA 3.0',
        url: 'https://creativecommons.org/licenses/by-sa/3.0',
      },
    },
  ],
  meanings: [
    {
      partOfSpeech: 'noun',
      definitions: [
        {
          definition: `Definition for ${word}`,
          example: `Example for ${word}`,
          synonyms: [`${word}-syn`],
          antonyms: [`${word}-ant`],
        },
      ],
      synonyms: [`${word}-syn-group`],
      antonyms: [`${word}-ant-group`],
    },
  ],
  license: {
    name: 'CC BY-SA 3.0',
    url: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  sourceUrls: [`https://source.example/${word}`],
});

export const createDictionaryApiServiceMock =
  (): jest.Mocked<IDictionaryApiService> => {
    return {
      getDefinitionWord: jest.fn().mockImplementation(async (params) => {
        return makeDictionaryEntryMock(params.word);
      }),
    };
  };
