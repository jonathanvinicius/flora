import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayloadDto } from '../dto';

/**
 * Protecting endpoints by requiring a valid JWT be present on the request
 *
 * Security: Bearer
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      
    });
  }

  /**
   * Inject 'user' on request
   */
  validate(payload: JWTPayloadDto) {
    return payload;
  }
}
