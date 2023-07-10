const Recipe = require("../../models/Recipe");
const Category = require("../../models/Category");
const Ingredient = require("../../models/Ingredient");

exports.fetchRecipe = async (recipeId, next) => {
  try {
    const recipe1 = await Recipe.findById(recipeId);
    return recipe1;
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .select("-__v")
      .populate("author", "username image");
    return res.status(200).json(recipes);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const recipes = await Recipe.findOne({ _id: req.recipe._id }).select(
      "-__v"
    );
    return res.status(200).json(recipes);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.createRecipe = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    const newRecipe = await Recipe.create(req.body);

    await req.user.updateOne({ $push: { recipes: newRecipe._id } });

    if (req.body.categories.length > 0) {
      req.body.categories.forEach(async (category) => {
        const foundCategory = await Category.findById(category);
        await newRecipe.updateOne({ $push: { categories: foundCategory._id } });
        await foundCategory.updateOne({ $push: { recipes: newRecipe._id } });
      });
    }
    if (req.body.ingredients?.length > 0) {
      req.body.ingredients.forEach(async (ingredient) => {
        const foundIngredient = await Ingredient.findById(ingredient);
        await newRecipe.updateOne({
          $push: { ingredients: foundIngredient._id },
        });
        await foundIngredient.updateOne({ $push: { recipes: newRecipe._id } });
      });
    }
    return res.status(201).json(newRecipe);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    if (!req.user._id.equals(req.recipe.author))
      return next({
        status: 400,
        message: "you dont have the permission to preform this task!",
      });
    await req.recipe.updateOne(req.body);
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    if (!req.user._id.equals(req.recipe.author))
      return next({
        status: 400,
        message: "you dont have the permission to preform this task!",
      });
    await req.recipe.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
