const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

const up = async () => {
  const qi = sequelize.getQueryInterface();

  console.log("🚀 Running migration: add skipped_reason");

  await qi.addColumn('assigned_tasks', 'skipped_reason', {
    type: Sequelize.TEXT,
    allowNull: true,
    comment: 'Reason why task was skipped (e.g., advanced to next level)'
  });

  await qi.addIndex('assigned_tasks', ['skipped_reason']);

  console.log("✅ Migration completed");
};

const down = async () => {
  const qi = sequelize.getQueryInterface();

  await qi.removeIndex('assigned_tasks', ['skipped_reason']);
  await qi.removeColumn('assigned_tasks', 'skipped_reason');
};

up()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });