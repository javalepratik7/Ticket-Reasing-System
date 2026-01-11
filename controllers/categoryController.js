const db = require('../models');
const IssueCategory = db.IssueCategory;

exports.createCategory = async (req, res) => {
  try {
    const category = await IssueCategory.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating category', error });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await IssueCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

exports.getCategoryByType = async (req, res) => {
  try {
    const category = await IssueCategory.findOne({ where: { typeOfCategory: req.params.type } });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching category', error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await IssueCategory.update(req.body, { where: { typeOfCategory: req.params.type } });
    if (updated[0] === 0) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating category', error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await IssueCategory.destroy({ where: { typeOfCategory: req.params.type } });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
