// models/IssueCount.js
module.exports = (sequelize, DataTypes) => {
  const IssueCount = sequelize.define('IssueCount', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    low_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    medium_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    high_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    critical_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  IssueCount.associate = models => {
    IssueCount.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return IssueCount;
};
