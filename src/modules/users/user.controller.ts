import {
  ApiDataResponse,
  ApiErrorResponse,
  ApiPaginatedResponse,
  ITokenPayload,
} from '@app/shared/decorators';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RESOURCE_USERS } from '../docs/resources';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTokenProperty } from '@app/shared/decorators/api-token-property.decorator';
import { PageDto, PageOptionsDto } from '@app/shared/dtos';
import { IUserService } from './user.service.interface';
import { CacheInterceptor } from '../../infra/interceptors/cache.interceptor';
import { CacheTTL } from '@app/infra/modules/cache';
import {
  GetUserFavoriteWordsResponse,
  GetUserMeResponse,
  GetUserWordHistoryResponse,
} from './responses';

@ApiBearerAuth()
@ApiErrorResponse()
@ApiTags(RESOURCE_USERS.tag)
@Controller(RESOURCE_USERS.route)
export class UserController {
  constructor(private readonly service: IUserService) {}

  @ApiOperation({
    summary: 'List user favorite words',
    description:
      'Returns a paginated list of words marked as favorites by the authenticated user.',
  })
  @ApiPaginatedResponse({
    type: GetUserFavoriteWordsResponse,
    description: 'List user favorite words',
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @Get('/me/favorites')
  async getUserFavoriteWords(
    @Param() params: PageOptionsDto,
    @ApiTokenProperty() tokenPayload: ITokenPayload,
  ): Promise<PageDto<GetUserFavoriteWordsResponse>> {
    return this.service.getUserFavoriteWords(params, tokenPayload.userId);
  }

  @ApiOperation({
    summary: 'Get current user information',
    description:
      'Retrieves profile and account information of the authenticated user.',
  })
  @ApiDataResponse({
    type: GetUserMeResponse,
    description: 'Get current user information',
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @Get('/me')
  async getUserMe(
    @ApiTokenProperty() tokenPayload: ITokenPayload,
  ): Promise<GetUserMeResponse> {
    return this.service.getUserMe(tokenPayload.userId);
  }

  @ApiOperation({
    summary: 'Get user search history',
    description:
      'Returns a paginated list of words previously searched by the authenticated user.',
  })
  @ApiPaginatedResponse({
    type: GetUserWordHistoryResponse,
    description: 'Get user search history',
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @Get('/me/history')
  async getUserMeHistory(
    @Param() params: PageOptionsDto,
    @ApiTokenProperty() tokenPayload: ITokenPayload,
  ): Promise<PageDto<GetUserWordHistoryResponse>> {
    return this.service.getUserWordHistory(params, tokenPayload.userId);
  }
}
