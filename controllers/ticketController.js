const db = require('../models');
const Ticket = db.Ticket;
const TicketAssignmentService = require('../services/ticketAssignmentService');


exports.createTicket = async (req, res) => {
  try {
    const ticketData = req.body;

    if (!ticketData.Subject || !ticketData.priority) {
      return res.status(400).json({
        message: 'Subject and priority are required'
      });
    }

    // Optional creator info (public user)
    ticketData.createdByUsername = ticketData.createdByUsername || 'Anonymous';
    ticketData.createdByUserEmail = ticketData.createdByUserEmail || null;

    // Auto-assign internally
    const assignedUser = await TicketAssignmentService.assignTicket(
      ticketData.priority
    );

    if (assignedUser) {
      ticketData.assignedToUserId = assignedUser.id;
    }

    const ticket = await Ticket.create(ticketData);

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create Ticket Error:', error);
    res.status(500).json({
      message: 'Error creating ticket',
      error: error.message
    });
  }
};

// Get only tickets assigned to the logged-in user
exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    console.log("responce is ",userId)
    const tickets = await Ticket.findAll({
      where: { assignedToUserId: userId }
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

// Get all tickets (for team-leader or admin)
exports.getAllTickets = async (req, res) => {
  try {
    // Optional: Check if user has permission to see all tickets
    if (req.user.role !== 'team-leader') {
      return res.status(403).json({ message: 'Unauthorized to view all tickets' });
    }
    
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all tickets', error: error.message });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userEmail = req.user.email;

    // Find the ticket
    const ticket = await Ticket.findByPk(id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user is authorized to update this ticket
    // User can update if they are assigned to it or are a team-leader
    if (ticket.assignedToEmail !== userEmail && req.user.role !== 'team-leader') {
      return res.status(403).json({ message: 'Unauthorized to update this ticket' });
    }

    // If priority is being changed and ticket is reassigned
    if (updateData.priority && updateData.priority !== ticket.priority) {
      // Decrement old priority count for current assignee
      if (ticket.assignedToEmail) {
        await TicketAssignmentService.updateIssueCount(
          ticket.assignedToEmail,
          ticket.priority,
          false
        );
      }

      // Auto-reassign based on new priority
      const newAssignedUser = await TicketAssignmentService.findBestUserForTicket(updateData.priority);
      
      if (newAssignedUser) {
        updateData.assignedToEmail = newAssignedUser.email;
        
        // Increment new priority count for new assignee
        await TicketAssignmentService.updateIssueCount(
          newAssignedUser.email,
          updateData.priority,
          true
        );
      }
    }

    // Update the ticket
    const updatedTicket = await ticket.update(updateData);
    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;

    // Find the ticket
    const ticket = await Ticket.findByPk(id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user is authorized to delete
    // Only team-leader or assigned user can delete
    if (ticket.assignedToEmail !== userEmail && req.user.role !== 'team-leader') {
      return res.status(403).json({ message: 'Unauthorized to delete this ticket' });
    }

    // Decrement issue count for the assigned user
    if (ticket.assignedToEmail) {
      await TicketAssignmentService.updateIssueCount(
        ticket.assignedToEmail,
        ticket.priority,
        false
      );
    }

    // Delete the ticket
    await ticket.destroy();
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
};