'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { schema: 'flora', tableName: 'user_search_histories' },
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          unique: true,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        word: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        provider: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'dictionaryapi',
        },

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
      { schema: 'flora', tableName: 'user_search_histories' },
      {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_user_search_histories_user_id',
        references: {
          table: { schema: 'flora', tableName: 'users' },
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    );

    await queryInterface.addConstraint(
      { schema: 'flora', tableName: 'user_search_histories' },
      {
        fields: ['word', 'user_id'],
        type: 'unique',
        name: 'uq_user_search_histories_word_user_id',
      },
    );

    await queryInterface.addIndex(
      { schema: 'flora', tableName: 'user_search_histories' },
      ['word'],
      { name: 'idx_history_word' },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      schema: 'flora',
      tableName: 'user_search_histories',
    });
  },
};
