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

// exports.createRecipe = async (req, res, next) => {
//   try {
//     req.body.author = req.user._id;
//     const newRecipe = await Recipe.create(req.body);

//     await req.user.updateOne({ $push: { recipes: newRecipe._id } });

//     if (req.body.categories.length > 0) {
//       req.body.categories.forEach(async (category) => {
//         const foundCategory = await Category.findById(category);
//         await newRecipe.updateOne({ $push: { categories: foundCategory._id } });
//         await foundCategory.updateOne({ $push: { recipes: newRecipe._id } });
//       });
//     }
//     if (req.body.ingredients?.length > 0) {
//       req.body.ingredients.forEach(async (ingredient) => {
//         const foundIngredient = await Ingredient.findById(ingredient);
//         await newRecipe.updateOne({
//           $push: { ingredients: foundIngredient._id },
//         });
//         await foundIngredient.updateOne({ $push: { recipes: newRecipe._id } });
//       });
//     }
//     return res.status(201).json(newRecipe);
//   } catch (error) {
//     return next({ status: 400, message: error.message });
//   }
// };

exports.createRecipe = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }
    if (!req.body.image)
      return next({ status: 400, message: "no image was uploaded!" });

    if (req.body.image.length < 5) {
      req.body.image = "media/defaultImage.png";
    }
    const { categories, ingredients, ...recipeData } = req.body;

    const newRecipe = await Recipe.create(recipeData);

    await req.user.updateOne({ $push: { recipes: newRecipe._id } });

    if (categories?.length > 0) {
      for (let categoryName of categories) {
        const foundCategory = await Category.findOneAndUpdate(
          { name: categoryName.toLowerCase() },
          { $addToSet: { recipes: newRecipe._id } },
          { upsert: true, new: true }
        );
        await newRecipe.updateOne({ $push: { categories: foundCategory._id } });
      }
    }

    if (ingredients?.length > 0) {
      for (let ingredientName of ingredients) {
        const foundIngredient = await Ingredient.findOneAndUpdate(
          { name: ingredientName.toLowerCase() },
          { $addToSet: { recipes: newRecipe._id } },
          { upsert: true, new: true }
        );
        await newRecipe.updateOne({
          $push: { ingredients: foundIngredient._id },
        });
      }
    }

    return res.status(201).json(newRecipe);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

// exports.updateRecipe = async (req, res, next) => {
//   try {
//     if (!req.user._id.equals(req.recipe.author))
//       return next({
//         status: 400,
//         message: "you dont have the permission to preform this task!",
//       });
//     await req.recipe.updateOne(req.body);
//     return res.status(204).end();
//   } catch (error) {
//     return next({ status: 400, message: error.message });
//   }
// };
exports.updateRecipe = async (req, res, next) => {
  try {
    if (!req.user._id.equals(req.recipe.author)) {
      return next({
        status: 400,
        message: "You don't have the permission to perform this task!",
      });
    }
    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }

    if (!req.body.image)
      return next({ status: 400, message: "no image was uploaded!" });

    if (req.body.image?.length < 5) {
      req.body.image = "media/defaultImage.png";
    }
    const oldRecipe = await Recipe.findById(req.recipe._id).populate(
      "categories ingredients"
    );

    const oldCategories = oldRecipe.categories.map((cat) =>
      cat.name.toLowerCase()
    );

    const oldIngredients = oldRecipe.ingredients.map((ing) =>
      ing.name.toLowerCase()
    );
    const newCategories = (req.body.categories || []).map((cat) =>
      cat.toLowerCase()
    );
    const newIngredients = (req.body.ingredients || []).map((ing) =>
      ing.toLowerCase()
    );
    console.log(oldCategories, newCategories);
    const categoriesToAdd = newCategories;
    const categoriesToRemove = oldCategories.filter(
      (cat) => !newCategories.includes(cat.toLowerCase())
    );

    const ingredientsToAdd = newIngredients;
    const ingredientsToRemove = oldIngredients.filter(
      (ing) => !newIngredients.includes(ing.toLowerCase())
    );

    const categoryUpdates = [];
    const ingredientUpdates = [];
    // Add new categories and ingredients to recipe and recipe to category and ingredient
    for (let categoryName of categoriesToAdd) {
      categoryUpdates.push(
        Category.findOneAndUpdate(
          { name: categoryName.toLowerCase() },
          { $addToSet: { recipes: req.recipe._id } },
          { new: true, upsert: true }
        )
      );
    }

    for (let ingredientName of ingredientsToAdd) {
      ingredientUpdates.push(
        Ingredient.findOneAndUpdate(
          { name: ingredientName.toLowerCase() },
          { $addToSet: { recipes: req.recipe._id } },
          { new: true, upsert: true }
        )
      );
    }

    const addedCategories = await Promise.all(categoryUpdates);
    const addedIngredients = await Promise.all(ingredientUpdates);

    // Add new categories and ingredients to recipe
    const newCategoriesIds = addedCategories.map((category) => category._id);
    const newIngredientsIds = addedIngredients.map(
      (ingredient) => ingredient._id
    );

    await req.recipe.updateOne({
      $push: {
        categories: { $each: newCategoriesIds },
        ingredients: { $each: newIngredientsIds },
      },
    });

    // Remove old categories and ingredients from recipe and recipe from category and ingredient
    for (let categoryName of categoriesToRemove) {
      const foundCategory = await Category.findOne({ name: categoryName });
      if (foundCategory) {
        await foundCategory.updateOne({ $pull: { recipes: req.recipe._id } });
        await req.recipe.updateOne({
          $pull: { categories: foundCategory._id },
        });
      }
    }

    for (let ingredientName of ingredientsToRemove) {
      const foundIngredient = await Ingredient.findOne({
        name: ingredientName,
      });
      if (foundIngredient) {
        await foundIngredient.updateOne({ $pull: { recipes: req.recipe._id } });
        await req.recipe.updateOne({
          $pull: { ingredients: foundIngredient._id },
        });
      }
    }

    // Update the recipe
    req.body.categories = newCategoriesIds;
    req.body.ingredients = newIngredientsIds;

    const updatedRecipe = await req.recipe
      .updateOne(req.body, { new: true })
      .populate("categories ingredients");
    return res.status(201).json(updatedRecipe);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

// exports.deleteRecipe = async (req, res, next) => {
//   try {
//     if (!req.user._id.equals(req.recipe.author))
//       return next({
//         status: 400,
//         message: "you dont have the permission to preform this task!",
//       });
//     await req.recipe.deleteOne();
//     return res.status(204).end();
//   } catch (error) {
//     return next({ status: 400, message: error.message });
//   }
// };
exports.deleteRecipe = async (req, res, next) => {
  try {
    if (!req.user._id.equals(req.recipe.author))
      return next({
        status: 400,
        message: "You don't have the permission to perform this task!",
      });

    const recipe = await Recipe.findById(req.recipe._id);

    // Remove recipe reference from categories
    for (let cat of recipe.categories) {
      const foundCategory = await Category.findById(cat);
      await foundCategory.updateOne({ $pull: { recipes: req.recipe._id } });
    }

    // Remove recipe reference from ingredients
    for (let ing of recipe.ingredients) {
      const foundIngredient = await Ingredient.findById(ing);
      await foundIngredient.updateOne({ $pull: { recipes: req.recipe._id } });
    }

    // Delete the recipe itself
    await req.recipe.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
