import { IJWTTokenData } from '@app/infra/interfaces';
import { JWTTokenResponse } from '../responses';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IGenerateTokenUser } from './generate-token-user.inteface';

@Injectable()
export class GenerateTokenUser implements IGenerateTokenUser {
  constructor(private readonly jwtService: JwtService) {}
  /**
   * Generates Token's JWT
   */
  async generateToken(data: IJWTTokenData): Promise<JWTTokenResponse> {
    const token = this.jwtService.sign(data);

    return { token };
  }
}
