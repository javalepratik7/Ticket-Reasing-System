const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route: anyone can create tickets without authentication
router.post('/', upload.single('attachment'),ticketController.createTicket);

// Protected routes: require authentication
router.get('/', authMiddleware, ticketController.getMyTickets); // Get only user's assigned tickets
router.get('/all', authMiddleware, ticketController.getAllTickets); // Get all tickets (for team-leader maybe)
router.put('/:id', authMiddleware, ticketController.updateTicket);
router.delete('/:id', authMiddleware, ticketController.deleteTicket);

module.exports = router;