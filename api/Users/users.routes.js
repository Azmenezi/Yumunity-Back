const express = require("express");
const {
  getUsers,
  signup,
  updateUser,
  deleteUser,
  fetchUser,
  signin,
} = require("./user.controllers");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/images/multer");
const { hashing } = require("../../utils/auth/password");
const {
  FieldValidation,
  inputValidator,
  passwordValidator,
  emailValidator,
} = require("../../middlewares/users/userValidation");

router.param("userId", async (req, res, next, userId) => {
  try {
    const foundUser = await fetchUser(userId);
    if (!foundUser) return next({ status: 404, message: "User not found" });
    req.user = foundUser;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getUsers);
router.post(
  "/signup",
  upload.single("image"),
  inputValidator([...emailValidator, ...passwordValidator], true),
  FieldValidation,
  hashing,
  signup
);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;
