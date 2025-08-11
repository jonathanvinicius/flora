import { registerAs } from '@nestjs/config';
type DatabaseCredentials = {
  user: string;
  password: string;
};
/**
 * Load database credentials
 *
 * @returns {DatabaseCredentials} Database Credentials
 */
function getDatabaseCredentials(): DatabaseCredentials {
  //default credentials for env
  const dbCredentials = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };

  return dbCredentials;
}

/**
 * Register `db` over environment
 */
export default registerAs('db', () => {
  const dbCredentials = getDatabaseCredentials();

  return {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    ...dbCredentials,
  };
});
