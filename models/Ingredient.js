const { model, Schema } = require("mongoose");

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: "User" },
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

module.exports = model("Ingredient", IngredientSchema);
