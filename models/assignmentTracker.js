// models/assignmentTracker.js
module.exports = (sequelize, DataTypes) => {
  const AssignmentTracker = sequelize.define('AssignmentTracker', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      unique: true, // One tracker per priority level
      field: 'priority'
    },
    lastAssignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'last_assigned_user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    lastAssignedIndex: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: -1,
      field: 'last_assigned_index'
    }
  }, {
    tableName: 'assignment_tracker',
    timestamps: true,
    underscored: true
  });

  AssignmentTracker.associate = function(models) {
    AssignmentTracker.belongsTo(models.User, {
      foreignKey: 'lastAssignedUserId',
      as: 'lastAssignedUser'
    });
  };

  return AssignmentTracker;
};