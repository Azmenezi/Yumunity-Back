const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/errors/notFoundHandler");
const errorHandler = require("./middlewares/errors/errorHandler");
const userRoutes = require("./api/Users/users.routes");
const recipeRoutes = require("./api/Recipes/recipes.routes");
const categoryRoutes = require("./api/Categories/categories.routes");
const ingredientRoutes = require("./api/Ingredients/ingredients.routes");
const config = require("./config/keys");
const path = require("path");
const passport = require("passport");
const {
  localStrategy,
  jwtStrategy,
} = require("./middlewares/passport/passport");

app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use(jwtStrategy);

app.use("/media", express.static(path.join(__dirname, "media")));
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/categories", categoryRoutes);
app.use("/ingredients", ingredientRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`The application is running on ${config.PORT}`);
});

module.exports = app;
