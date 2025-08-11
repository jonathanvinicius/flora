import { registerAs } from '@nestjs/config';

/**
 * Register `jwt` over environment
 */
export default registerAs('jwt', () => {
  return {
    secretKey: process.env.JWT_ACCESS_SECRET,
    refreshSecretKey: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    expiresInRefresh: process.env.JWT_REFRESH_EXPIRES_IN ?? '1d',
    saltRounds: process.env.SALT_ROUNDS_PASSWORD,
  };
});
