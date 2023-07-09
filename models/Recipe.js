const { model, Schema } = require("mongoose");

const RecipeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  text: { type: String, required: true },
  ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
});

module.exports = model("Recipe", RecipeSchema);
