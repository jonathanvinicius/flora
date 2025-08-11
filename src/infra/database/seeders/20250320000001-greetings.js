'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'greetings',
      [
        {
          uuid: Sequelize.literal('uuid_generate_v4()'),
          message: 'Hello from Docker container!',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: Sequelize.literal('uuid_generate_v4()'),
          message: 'Welcome to NestJS Microservice Template',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('greetings', null, {});
  },
};
