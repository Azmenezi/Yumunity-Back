const { model, Schema } = require("mongoose");

const RecipeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  text: { type: String, required: true },
  ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
  categories:[{ type: Schema.Types.ObjectId, ref: "Category" }]
});

module.exports = model("Recipe", RecipeSchema);
