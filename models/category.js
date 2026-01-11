// models/category.js
module.exports = (sequelize, DataTypes) => {
  const IssueCategory = sequelize.define('IssueCategory', {
    typeOfCategory: { type: DataTypes.STRING, allowNull: false },
    questions: { type: DataTypes.TEXT, allowNull: true },
    answer: { type: DataTypes.TEXT, allowNull: true },
  });

  return IssueCategory;
};
