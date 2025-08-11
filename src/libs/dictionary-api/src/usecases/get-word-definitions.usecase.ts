import { IUsecase } from '@app/domain';
import { ErrorDefinitions } from '@app/domain/errors';
import { ApiClientService } from '@app/libs/request/src';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetWordDefinitionsDto } from '../dtos';
import {
  DictionaryEntry,
  GetDefinitionWordResponse,
} from '../responses/get-definition-word.response';

@Injectable()
export class GetWordDefinitionsUseCase implements IUsecase {
  constructor(private readonly api: ApiClientService) {}

  async execute(params: GetWordDefinitionsDto): Promise<DictionaryEntry> {
    try {
      const { data } = await this.api.get<GetDefinitionWordResponse>(
        `entries/en/${params.word}`,
      );

      const first = data?.[0];

      if (!first) {
        throw new NotFoundException({
          errorDefinition: ErrorDefinitions.NOT_FOUND,
        });
      }

      const {
        word,
        meanings = [],
        phonetics = [],
        license = null,
        sourceUrls = [],
      } = first;

      return {
        word,
        meanings,
        phonetics,
        license,
        sourceUrls,
      };
    } catch (error) {
      if (error.response?.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException({
          errorDefinition: ErrorDefinitions.WORD_NOT_FOUND,
        });
      }

      throw new HttpException(
        {
          errorDefinition: ErrorDefinitions.FAILED_DEPENDENCY,
        },
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }
}
