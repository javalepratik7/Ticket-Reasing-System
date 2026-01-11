module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      /* =====================
         CORE INFO
      ===================== */
      Subject: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      /* =====================
         STATUS & PRIORITY
      ===================== */
      status: {
        type: DataTypes.ENUM(
          'open',
          'inprogress',
          'waiting',
          'resolve',
          'closed'
        ),
        allowNull: false,
        defaultValue: 'open'
      },

      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false
      },

      /* =====================
         CREATOR (PUBLIC USER)
      ===================== */
      createdByUsername: {
        type: DataTypes.STRING,
        allowNull: false   // public user must give name
      },

      createdByUserEmail: {
        type: DataTypes.STRING,
        allowNull: false   // public user must give email
      },

      createdByUserPhone: {
        type: DataTypes.STRING,
        allowNull: true
      },

      /* =====================
         BUSINESS INFO
      ===================== */
      IssueCategory: {
        type: DataTypes.STRING,
        allowNull: true
      },

      OrderId: {
        type: DataTypes.STRING,
        allowNull: true
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      /* =====================
         ATTACHMENTS & NOTES
      ===================== */
      AttachmentUrl: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      InternalNotes: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      replay: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      replayAttachmentUrl: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      /* =====================
         ASSIGNMENT (INTERNAL)
      ===================== */
      assignedToUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: 'Tickets',
      timestamps: true
    }
  );

  return Ticket;
};
