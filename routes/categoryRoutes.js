const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Category routes
router.post('/', categoryController.createCategory);         // Create Category
router.get('/', categoryController.getAllCategories);        // Get all Categories
router.get('/:type', categoryController.getCategoryByType);  // Get Category by type
router.put('/:categoryId', categoryController.updateCategory); // Update Category
router.delete('/:categoryId', categoryController.deleteCategory); // Delete Category

// FAQs routes
router.post('/:categoryId/faqs', categoryController.addFAQ); // Add FAQ
router.put('/:categoryId/faqs/:faqId', categoryController.updateFAQ); // Update FAQ
router.delete('/:categoryId/faqs/:faqId', categoryController.deleteFAQ); // Delete FAQ

module.exports = router;
