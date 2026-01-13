const db = require('../models');
const Ticket = db.Ticket;
const TicketAssignmentService = require('../services/ticketAssignmentService');
const EmailService = require('../services/emailServices');
const { getUserDetailsFromShopify } = require('../services/userDetailsFromShopifyServices');
const { uploadFileToS3 } = require('../utils/s3Upload');

exports.createTicket = async (req, res) => {
  try {
    const ticketData = req.body;

    // 1️⃣ Basic validation
    if (!ticketData.Subject || !ticketData.priority) {
      return res.status(400).json({
        message: 'Subject and priority are required'
      });
    }

    if (!ticketData.OrderId) {
      return res.status(400).json({
        message: 'OrderId is required to create a ticket'
      });
    }

    // 2️⃣ Get Shopify user details
    try {
      const shopifyUser = await getUserDetailsFromShopify(ticketData.OrderId);

      ticketData.createdByUsername =
        shopifyUser.userName || 'Shopify Customer';
      ticketData.createdByUserEmail =
        shopifyUser.userEmail || null;
      ticketData.createdByUserPhone =
        shopifyUser.userPhoneNo || null;

    } catch (err) {
      console.error('Shopify fetch failed:', err.message);
      ticketData.createdByUsername = 'Unknown Customer';
      ticketData.createdByUserEmail = null;
      ticketData.createdByUserPhone = null;
    }

    // 3️⃣ Assign ticket internally
    const assignedUser = await TicketAssignmentService.assignTicket(
      ticketData.priority
    );

    if (assignedUser) {
      ticketData.assignedToUserId = assignedUser.id;
    }

    // 4️⃣ Create ticket first (needed for ticket.id)
    const ticket = await Ticket.create(ticketData);

    // 5️⃣ Upload attachment to S3 (if provided)
    if (req.file) {
      const attachmentUrl = await uploadFileToS3(req.file, ticket.id);

      ticket.AttachmentUrl = attachmentUrl;
      await ticket.save();
    }

    // 6️⃣ Email notification (non-blocking)
    if (ticket.createdByUserEmail) {
      EmailService.sendTicketCreatedEmail({
        to: ticket?.createdByUserEmail, 
        // to: 'pratik@yopmail.com', // Test the email services with dummy data 
        subject: ticket.Subject,
        description: ticket.description || 'N/A',
        status: ticket.status || 'OPEN',
        orderId: ticket.OrderId,
        ticketUrl: `${process.env.FRONTEND_URL}/tickets/${ticket.id}`
      }).catch(err => {
        console.error('Email send failed:', err.message);
      });
    }

    // 7️⃣ Response
    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });

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
    const userId =req.user.id

    // 1️⃣ Find ticket
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // 2️⃣ Authorization
    // Assigned user OR team-leader can update
    if (
      ticket.assignedToUserId !== userId &&
      req.user.role !== 'team-leader'
    ) {
      return res.status(403).json({ message: 'Unauthorized to update this ticket' });
    }

    // 3️⃣ Handle priority change (optional re-assignment logic)
    if (updateData.priority && updateData.priority !== ticket.priority) {
      const newAssignedUser = await TicketAssignmentService.assignTicket(updateData.priority);

      if (newAssignedUser) {
        updateData.assignedToUserId = newAssignedUser.id;
      }
    }

    // 4️⃣ Upload reply attachment to S3 (image / video / doc)
    if (req.file) {
      const replyAttachmentUrl = await uploadFileToS3(req.file, ticket.id);
      updateData.replayAttachmentUrl = replyAttachmentUrl;
    }

    // 5️⃣ Update ticket
    const updatedTicket = await ticket.update(updateData);

    res.status(200).json({
      message: 'Ticket updated successfully',
      ticket: updatedTicket
    });

  } catch (error) {
    console.error('Update Ticket Error:', error);
    res.status(500).json({
      message: 'Error updating ticket',
      error: error.message
    });
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