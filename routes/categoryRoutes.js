const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Category
router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:type', categoryController.getCategoryByType);

// FAQs
router.post('/:categoryId/faqs', categoryController.addFAQ);

module.exports = router;
