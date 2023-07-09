const Recipe = require("../../models/Recipe");

exports.fetchRecipe = async (recipeId, next) => {
  try {
    const recipe1 = await Recipe.findById(recipeId);
    return recipe1;
  } catch (error) {
    return next(error);
  }
};

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .select("-__v")
      .populate("author", "username image");
    return res.status(200).json(recipes);
  } catch (error) {
    return next(error);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const recipes = await Recipe.findOne({ _id: req.recipe._id }).select(
      "-__v"
    );
    return res.status(200).json(recipes);
  } catch (error) {
    return next(error);
  }
};

exports.createRecipe = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    const newRecipe = await Recipe.create(req.body);

    return res.status(201).json(newRecipe);
  } catch (error) {
    return next(error);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    await req.recipe.id.updateOne(req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    await req.recipe.id.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
