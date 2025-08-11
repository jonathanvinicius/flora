import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiDataResponse,
  ApiErrorResponse,
  ApiPaginatedResponse,
  ITokenPayload,
  Public,
} from '@app/shared/decorators';
import { IWordService } from './word.service.interface';
import { RESOURCE_WORDS } from '../docs/resources';
import { GetWordDefinitionsDto } from './dtos/get-word-definitions.dto';
import { ApiTokenProperty } from '@app/shared/decorators/api-token-property.decorator';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SAVE_WORD_USER_HISTORY_PATTERN } from '@app/infra/modules/rabbitmq/src/services/word-user-history';
import { IRabbitMqService } from '@app/infra/modules/rabbitmq/src';
import { CacheInterceptor } from '../../infra/interceptors/cache.interceptor';
import { CacheTTL } from '@app/infra/modules/cache';
import { PageDto } from '@app/shared/dtos';
import {
  SAVE_USER_FAVORITE_WORD_PATTERN,
  SAVE_USER_UNFAVORITE_WORD_PATTERN,
} from '@app/infra/modules/rabbitmq/src/services/user-favorite-words';
import {
  GetWordsDto,
  PostUserFavoriteDto,
  SaveUserFavoriteWordDto,
  SaveUserHistoryDto,
  UserUnfavoriteWordDto,
} from './dtos';
import {
  GetEnglishDictionaryResponse,
  GetWordDefinitionsResponse,
  GetWordsResponse,
} from './responses';

@ApiBearerAuth()
@ApiErrorResponse()
@ApiTags(RESOURCE_WORDS.tag)
@Controller(RESOURCE_WORDS.route)
export class WordsController {
  constructor(
    private readonly service: IWordService,
    private readonly rabbitMqService: IRabbitMqService,
  ) {}

  @ApiOperation({
    summary: 'Get English dictionary info',
    description: 'Returns general information about the English dictionary.',
  })
  @ApiDataResponse({
    type: GetEnglishDictionaryResponse,
    description: 'English Dictionary',
  })
  @UseInterceptors(CacheInterceptor)
  @Public()
  @CacheTTL(300000)
  @Get()
  async getEnglishDictionary(): Promise<GetEnglishDictionaryResponse> {
    return this.service.getEnglishDictionary();
  }

  @ApiOperation({
    summary: 'Get word definitions',
    description:
      'Retrieves detailed definitions of a specific word and records the search in the user history.',
  })
  @ApiDataResponse({
    type: GetWordDefinitionsResponse,
    description: 'Get Word definitions',
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @Get('entries/en/:word')
  async getWordDefinitions(
    @Param() param: GetWordDefinitionsDto,
    @ApiTokenProperty() tokenPayload: ITokenPayload,
  ): Promise<GetWordDefinitionsResponse> {
    return this.service.getDefinitionsWord(param, tokenPayload.userId);
  }

  @ApiOperation({
    summary: 'List words',
    description:
      'Returns a paginated list of words available in the English dictionary.',
  })
  @ApiPaginatedResponse({ type: GetWordsResponse, description: 'List words' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @Get('entries/en')
  async getWords(
    @Query() params: GetWordsDto,
  ): Promise<PageDto<GetWordsResponse>> {
    return this.service.getWords(params);
  }

  @ApiOperation({
    summary: 'Add word to favorites',
    description:
      'Marks a specific word as a favorite for the authenticated user.',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('entries/en/:word/favorite')
  async postSaveUserFavoriteWord(
    @Param() params: PostUserFavoriteDto,
    @ApiTokenProperty() tokenPayload: ITokenPayload,
  ): Promise<void> {
    await this.service.postUserFavoriteWord(params, tokenPayload.userId);
  }

  @ApiOperation({
    summary: 'Remove word from favorites',
    description:
      'Removes a specific word from the authenticated user’s favorites list.',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('entries/en/:word/unfavorite')
  async deleteSaveUserFavoriteWord(
    @Param() params: PostUserFavoriteDto,
    @ApiTokenProperty() tokenPayload: ITokenPayload,
  ): Promise<void> {
    await this.service.deleteUserFavoriteWord(params, tokenPayload.userId);
  }

  @EventPattern(SAVE_WORD_USER_HISTORY_PATTERN)
  async saveHistoryUser(
    @Ctx() context: RmqContext,
    @Payload() payload: SaveUserHistoryDto,
  ) {
    try {
      await this.rabbitMqService.processMessage<SaveUserHistoryDto>(
        context,
        payload,
        async () => await this.service.saveUserHistory(payload),
        'saveHistoryUser',
      );
    } catch (error) {
      await this.rabbitMqService.retryMessage(context, {
        headers: { 'x-delay': 5000 },
      });
    }
  }

  @EventPattern(SAVE_USER_FAVORITE_WORD_PATTERN)
  async saveUserFavoriteWord(
    @Ctx() context: RmqContext,
    @Payload() payload: SaveUserFavoriteWordDto,
  ) {
    try {
      await this.rabbitMqService.processMessage<SaveUserFavoriteWordDto>(
        context,
        payload,
        async () => await this.service.saveUserFavoriteWord(payload),
        'saveUserFavoriteWord',
      );
    } catch (error) {
      await this.rabbitMqService.retryMessage(context, {
        headers: { 'x-delay': 5000 },
      });
    }
  }

  @EventPattern(SAVE_USER_UNFAVORITE_WORD_PATTERN)
  async userUnfavoriteWord(
    @Ctx() context: RmqContext,
    @Payload() payload: UserUnfavoriteWordDto,
  ) {
    try {
      await this.rabbitMqService.processMessage<UserUnfavoriteWordDto>(
        context,
        payload,
        async () => await this.service.userUnfavorite(payload),
        'saveUserUnfavoriteWord',
      );
    } catch (error) {
      await this.rabbitMqService.retryMessage(context, {
        headers: { 'x-delay': 5000 },
      });
    }
  }
}
