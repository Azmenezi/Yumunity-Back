const express = require("express");
const {
  fetchIngredient,
  getIngredient,
  createIngredient,
  // Uncomment these if you need them
  // updateIngredient,
  // deleteIngredient
} = require("./ingredients.controllers");
const passport = require("passport");
const router = express.Router();

router.param("ingredientId", async (req, res, next, ingredientId) => {
  const foundIngredient = await fetchIngredient(ingredientId);
  if (foundIngredient) {
    req.ingredient = foundIngredient;
    next();
  } else {
    next({ status: 404, message: "Ingredient not found" });
  }
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getIngredient
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createIngredient
);
// router.put("/:ingredientId", passport.authenticate("jwt", { session: false }), updateIngredient);
// router.delete("/:ingredientId", passport.authenticate("jwt", { session: false }), deleteIngredient);

module.exports = router;
