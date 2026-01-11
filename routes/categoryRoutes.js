const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create a new category FAQ
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by type
router.get('/:type', categoryController.getCategoryByType);

// Update category by type
router.put('/:type', categoryController.updateCategory);

// Delete category by type
router.delete('/:type', categoryController.deleteCategory);

module.exports = router;
