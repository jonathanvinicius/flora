import { IJWTTokenData } from '@app/infra/interfaces';
import { Injectable } from '@nestjs/common';
import { JWTTokenResponse } from '../responses';

@Injectable()
export abstract class IGenerateTokenUser {
  /**
   * Generate token
   */
  abstract generateToken(data: IJWTTokenData): Promise<JWTTokenResponse>;
}
