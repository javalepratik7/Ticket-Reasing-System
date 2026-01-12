// models/categoryFAQ.js
module.exports = (sequelize, DataTypes) => {
  const CategoryFAQ = sequelize.define('CategoryFAQ', {
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return CategoryFAQ;
};
