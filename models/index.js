const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/* ===== MODELS ===== */
db.User = require('./user')(sequelize, DataTypes);
db.Ticket = require('./ticket')(sequelize, DataTypes);
db.IssueCategory = require('./category')(sequelize, DataTypes);
db.CategoryFAQ = require('./categoryFAQ')(sequelize, DataTypes);
db.IssueCount = require('./issueCount')(sequelize, DataTypes);
db.RoundRobinState = require('./RoundRobinState')(sequelize, DataTypes);

/* ===== ASSOCIATIONS ===== */

// Category → FAQs
db.IssueCategory.hasMany(db.CategoryFAQ, {
  foreignKey: 'categoryId',
  as: 'faqs',
  onDelete: 'CASCADE'
});

db.CategoryFAQ.belongsTo(db.IssueCategory, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Ticket → Category
db.Ticket.belongsTo(db.IssueCategory, {
  foreignKey: 'categoryId',
  as: 'category'
});

db.IssueCategory.hasMany(db.Ticket, {
  foreignKey: 'categoryId',
  as: 'tickets'
});

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('✅ Database synced');
})();

module.exports = db;
