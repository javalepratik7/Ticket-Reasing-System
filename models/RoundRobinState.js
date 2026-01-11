// models/RoundRobinState.js
module.exports = (sequelize, DataTypes) => {
  const RoundRobinState = sequelize.define('RoundRobinState', {
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      unique: true
    },
    lastAssignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  return RoundRobinState;
};
