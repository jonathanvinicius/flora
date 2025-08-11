'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createSchema('flora');
  },

  async down(queryInterface) {
    await queryInterface.dropSchema('flora');
  },
};
