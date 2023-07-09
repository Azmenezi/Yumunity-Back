const express = require("express");
const {
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  fetchRecipe,
} = require("./recipes.controllers");
const router = express.Router();

// Everything with the word recipe is a placeholder that you'll change in accordance with your project

router.param("recipeId", async (req, res, next, recipeId) => {
  try {
    const foundRecipe = await fetchRecipe(recipeId);
    if (!foundRecipe) return next({ status: 404, message: "Recipe not found" });
    req.recipe = foundRecipe;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", getRecipe);
router.post("/", createRecipe);
router.put("/:recipeId", updateRecipe);
router.delete("/:recipeId", deleteRecipe);

module.exports = router;