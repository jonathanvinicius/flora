import { IUsecase } from '@app/domain';
import { Injectable } from '@nestjs/common';
import { GetEnglishDictionaryResponse } from '../responses';

@Injectable()
export class GetEnglishDictionaryUseCase implements IUsecase {
  async execute(): Promise<GetEnglishDictionaryResponse> {
    return { message: 'English Dictionary' };
  }
}
