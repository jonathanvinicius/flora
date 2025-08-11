import { IJWTTokenData } from '@app/infra/interfaces/jwt-token-data.interface';

/**
 * User data authentication
 *
 * Token data
 */
export class JWTPayloadDto implements IJWTTokenData {
  userId: string;
  email: string;
}
