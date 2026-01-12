const db = require('../models');
const { IssueCategory, CategoryFAQ } = db;

exports.createCategory = async (req, res) => {
  try {
    const { typeOfCategory } = req.body;

    if (!typeOfCategory) {
      return res.status(400).json({ message: 'typeOfCategory is required' });
    }

    const category = await IssueCategory.create({ typeOfCategory });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFAQ = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question & Answer required' });
    }

    const faq = await CategoryFAQ.create({
      question,
      answer,
      categoryId
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await IssueCategory.findAll({
      include: [{ model: CategoryFAQ, as: 'faqs' }]
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryByType = async (req, res) => {
  try {
    const category = await IssueCategory.findOne({
      where: { typeOfCategory: req.params.type },
      include: [{ model: CategoryFAQ, as: 'faqs' }]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
