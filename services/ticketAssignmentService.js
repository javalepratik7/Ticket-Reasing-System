const db = require('../models');
const { User, IssueCount, RoundRobinState, sequelize } = db;

class TicketAssignmentService {

  /**
   * INTERNAL: Round-robin selection per priority
   */
  static async findUserByRoundRobin(priority, transaction) {
    const users = await User.findAll({
      where: { role: 'user' },
      order: [['id', 'ASC']],
      transaction
    });

    if (!users.length) return null;

    const [state] = await RoundRobinState.findOrCreate({
      where: { priority },
      defaults: { lastAssignedUserId: null },
      transaction
    });

    let nextUser;

    if (!state.lastAssignedUserId) {
      nextUser = users[0];
    } else {
      const lastIndex = users.findIndex(
        u => u.id === state.lastAssignedUserId
      );

      const nextIndex =
        lastIndex === -1
          ? 0
          : (lastIndex + 1) % users.length;

      nextUser = users[nextIndex];
    }

    state.lastAssignedUserId = nextUser.id;
    await state.save({ transaction });

    return nextUser;
  }

 static async updateIssueCount(userId, priority, increment = true, transaction) {
  const issueCount = await IssueCount.findOne({
    where: { userId },
    transaction
  });

  if (!issueCount) {
    return await IssueCount.create({
      userId,
      low_count: priority === 'low' ? 1 : 0,
      medium_count: priority === 'medium' ? 1 : 0,
      high_count: priority === 'high' ? 1 : 0,
      critical_count: priority === 'critical' ? 1 : 0
    }, { transaction });
  }

  const field = `${priority}_count`;
  issueCount[field] = increment
    ? issueCount[field] + 1
    : Math.max(0, issueCount[field] - 1);

  await issueCount.save({ transaction });
  return issueCount;
}


  /**
   * INTERNAL: Atomic assignment logic
   */
  static async assignTicket(priority) {
    return sequelize.transaction(async (transaction) => {
      const user = await this.findUserByRoundRobin(priority, transaction);

      if (!user) return null;

      await this.updateIssueCount(
        user.id,
        priority,
        true,
        transaction
      );

      return user;
    });
  }

  /**
   * ✅ PUBLIC METHOD (Controller calls THIS)
   */
  static async findBestUserForTicket(ticketData) {
    const { priority } = ticketData;

    if (!priority) {
      throw new Error('Ticket priority is required for assignment');
    }

    return await this.assignTicket(priority);
  }
}

module.exports = TicketAssignmentService;
