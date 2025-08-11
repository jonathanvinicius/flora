'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { schema: 'flora', tableName: 'user_favorite_words' },
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          unique: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        word_id: {
          type: Sequelize.UUID,
          allowNull: false,
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
      { schema: 'flora', tableName: 'user_favorite_words' },
      {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_user_favorite_words_user_id',
        references: {
          table: { schema: 'flora', tableName: 'users' },
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    );

    await queryInterface.addConstraint(
      { schema: 'flora', tableName: 'user_favorite_words' },
      {
        fields: ['word_id'],
        type: 'foreign key',
        name: 'fk_user_favorite_words_word_id',
        references: {
          table: { schema: 'flora', tableName: 'words' },
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      schema: 'flora',
      tableName: 'user_favorite_words',
    });
  },
};
