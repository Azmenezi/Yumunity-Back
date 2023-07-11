const Category = require("../../models/Category");
const Recipe = require("../../models/Recipe");
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
    const categories = await Category.find()
      .select("-__v")
      .populate("recipes", "name");
    return res.status(200).json(categories);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    req.body.addedBy = req.user._id;
    const newCategory = await Category.create(req.body);
    return res.status(201).json(newCategory);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
exports.recipesByCategory = async (req, res, next) => {
  try {
    const category = req.category;

    const recipes = await Recipe.find({ categories: category }).populate(
      "categories"
    );

    res.status(200).json(recipes);
  } catch (error) {
    next(error);
  }
};
// exports.updateCategory = async (req, res, next) => {
//   try {
//     await req.category.updateOne(req.body);
//     return res.status(204).end();
//   } catch (error) {
//     return next({ status: 400, message: error.message });
//   }
// };

// exports.deleteCategory = async (req, res, next) => {
//   try {
//     await req.category.deleteOne();
//     return res.status(204).end();
//   } catch (error) {
//     return next({ status: 400, message: error.message });
//   }
// };
