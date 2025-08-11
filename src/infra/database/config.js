require('dotenv').config();

module.exports = {
  build: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    define: {
      underscored: true,
      underscoredAll: true,
    },
    dialectOptions: {
      decimalNumbers: true,
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    define: {
      underscored: true,
      underscoredAll: true,
    },
    dialectOptions: {
      decimalNumbers: true,
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    define: {
      underscored: true,
      underscoredAll: true,
    },
    dialectOptions: {
      decimalNumbers: true,
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
};
