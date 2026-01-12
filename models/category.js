// models/category.js
module.exports = (sequelize, DataTypes) => {
  const IssueCategory = sequelize.define('IssueCategory', {
    typeOfCategory: { type: DataTypes.STRING, allowNull: false, unique: true }
  });

  return IssueCategory;
};
