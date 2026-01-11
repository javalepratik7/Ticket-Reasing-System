module.exports = (sequelize, DataTypes) => {
  const IssueCategory = sequelize.define(
    'IssueCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      tableName: 'IssueCategories',
      timestamps: false
    }
  );

  return IssueCategory;
};
