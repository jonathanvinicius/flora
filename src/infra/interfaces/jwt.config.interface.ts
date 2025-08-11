export interface IJWTConfig {
  secretKey: string;
  refreshSecretKey: string;
  expiresIn: string;
  expiresInRefresh: string;
  saltRounds: string;
}
