const express = require("express");
const {
  fetchCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./categories.controllers");
const passport = require("passport");
const router = express.Router();

router.param("categoryId", async (req, res, next, categoryId) => {
  try {
    const foundCategory = await fetchCategory(categoryId);
    if (!foundCategory)
      return next({ status: 404, message: "Category not found" });
    req.category = foundCategory;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getCategory);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createCategory
);
router.put(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  updateCategory
);
router.delete(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  deleteCategory
);

module.exports = router;
