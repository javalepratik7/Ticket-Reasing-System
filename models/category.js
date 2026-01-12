// models/category.js
module.exports = (sequelize, DataTypes) => {
  const IssueCategory = sequelize.define(
    'IssueCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      typeOfCategory: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium'
      }
    },
    {
      tableName: 'IssueCategories',
      timestamps: true
    }
  );

  return IssueCategory;
};
