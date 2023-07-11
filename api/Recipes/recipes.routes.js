const express = require("express");
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  fetchRecipe,
} = require("./recipes.controllers");
const passport = require("passport");
const upload = require("../../middlewares/images/multer");
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

router.get("/", getRecipes);
router.get("/:recipeId", getRecipeById);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),upload.single("image"),
  createRecipe
);
router.put(
  "/:recipeId",
  passport.authenticate("jwt", { session: false }),upload.single("image"),
  updateRecipe
);
router.delete(
  "/:recipeId",
  passport.authenticate("jwt", { session: false }),
  deleteRecipe
);

module.exports = router;
