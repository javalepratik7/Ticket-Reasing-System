const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

/* =====================
   SEQUELIZE INSTANCE
===================== */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/* =====================
   IMPORT MODELS
===================== */
db.User = require('./user')(sequelize, DataTypes);
db.Ticket = require('./ticket')(sequelize, DataTypes);
db.IssueCategory = require('./category')(sequelize, DataTypes);
db.IssueCount = require('./issueCount')(sequelize, DataTypes);
db.RoundRobinState = require('./RoundRobinState')(sequelize, DataTypes);

/* =====================
   ASSOCIATIONS
===================== */
function setupAssociations() {

  /* ---- User ↔ IssueCount ---- */
  db.User.hasOne(db.IssueCount, {
    foreignKey: 'userId',
    as: 'issueCount',
    onDelete: 'CASCADE'
  });

  db.IssueCount.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  /* ---- User ↔ Ticket (ASSIGNEE) ---- */
  db.User.hasMany(db.Ticket, {
    foreignKey: 'assignedToUserId',
    as: 'assignedTickets'
  });

  db.Ticket.belongsTo(db.User, {
    foreignKey: 'assignedToUserId',
    as: 'assignee'
  });

  /* ---- Round Robin State ↔ User ---- */
  db.RoundRobinState.belongsTo(db.User, {
    foreignKey: 'lastAssignedUserId',
    as: 'lastAssignedUser'
  });

  /* ---- Ticket ↔ Category (CORRECT WAY) ---- */
  db.Ticket.belongsTo(db.IssueCategory, {
    foreignKey: 'categoryId',
    as: 'category'
  });

  db.IssueCategory.hasMany(db.Ticket, {
    foreignKey: 'categoryId',
    as: 'tickets'
  });

  console.log('✅ Associations setup completed');
}

setupAssociations();

/* =====================
   DB INIT (SINGLE SOURCE OF TRUTH)
===================== */
async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync(); // ❗ NO alter / force in prod
    console.log('✅ Models synced');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDB();

module.exports = db;
