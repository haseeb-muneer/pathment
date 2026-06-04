const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

async function up() {
  const qi = sequelize.getQueryInterface();

  await qi.createTable('task_files', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey: true
    },
    roadmap_task_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'roadmap_tasks',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    file_name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    file_url: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    file_type: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    file_size_bytes: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    uploaded_by: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    uploaded_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW')
    }
  });

  await qi.addIndex('task_files', ['roadmap_task_id']);
  await qi.addIndex('task_files', ['uploaded_by']);
}

async function down() {
  const qi = sequelize.getQueryInterface();
  await qi.dropTable('task_files');
}

const run = async () => {
  try {
    if (process.argv.includes('--rollback')) {
      await down();
      console.log('Rolled back migration 007_add_task_files');
    } else {
      await up();
      console.log('Ran migration 007_add_task_files');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();