const Category = require("../../models/Category");

exports.fetchCategory = async (categoryId, next) => {
  try {
    const category = await Category.findById(categoryId);
    return category;
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categories = await Category.find().select("-__v").populate("addedBy");
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    req.body.addedBy = req.user._id;
    const newCategory = await Category.create(req.body);
    return res.status(201).json(newCategory);
  } catch (error) {
    return next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    await req.category.id.updateOne(req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await req.category.id.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
