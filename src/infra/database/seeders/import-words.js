import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JSON_FILE =
  process.env.WORDS_JSON_PATH ||
  resolve(__dirname, '../word-data/words_dictionary.json');

/** @type {import('sequelize-cli').Seeder} */
export default {
  async up(queryInterface, Sequelize) {
    const queryTransaction = await queryInterface.sequelize.transaction();
    try {
      const data = readFileSync(JSON_FILE, 'utf8');
      const json = JSON.parse(data);

      const uniqueWords = [...new Set(Object.keys(json))];

      const now = new Date();
      const rows = uniqueWords.map((name) => ({
        name,
        created_at: now,
        updated_at: now,
      }));
      await queryInterface.bulkInsert('words', rows, { transaction: queryTransaction });

      await queryTransaction.commit();
    } catch (err) {
      await queryTransaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transactionQuery = await queryInterface.sequelize.transaction();
    try {
      const data = readFileSync(JSON_FILE, 'utf8');
      const json = JSON.parse(data);
      const words = Object.keys(json);

      await queryInterface.bulkDelete(
        'words',
        { name: words },
        { transaction: transactionQuery },
      );
      await transactionQuery.commit();
    } catch (err) {
      await transactionQuery.rollback();
      throw err;
    }
  },
};
