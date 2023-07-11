const Ingredient = require("../../models/Ingredient");

exports.fetchIngredient = async (ingredientId, next) => {
  try {
    const ingredient = await Ingredient.findById(ingredientId);
    return ingredient;
  } catch (error) {
    next(error);
  }
};

exports.getIngredient = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find()
      .select("-__v")
      .populate("recipes", "name");
    return res.status(200).json(ingredients);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.createIngredient = async (req, res, next) => {
  try {
    req.body.addedBy = req.user._id;
    const newIngredient = await Ingredient.create(req.body);
    return res.status(201).json(newIngredient);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
