'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { schema: 'flora', tableName: 'words' },
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          unique: true,
          allowNull: false,
        },
        language: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'en',
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        phonetics: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        meanings: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        source_urls: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: true,
        },
        source: { type: Sequelize.BOOLEAN, allowNull: true },
        is_completed: { type: Sequelize.BOOLEAN, defaultValue: false },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
    );

    await queryInterface.addConstraint(
      { schema: 'flora', tableName: 'words' },
      {
        fields: ['language', 'name'],
        type: 'unique',
        name: 'uq_words_language_name',
      },
    );

    await queryInterface.addIndex(
      { schema: 'flora', tableName: 'words' },
      ['name'],
      { name: 'idx_words_name' },
    );

    await queryInterface.addIndex(
      { schema: 'flora', tableName: 'words' },
      ['language'],
      { name: 'idx_words_lang' },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      schema: 'flora',
      tableName: 'words',
    });
  },
};
