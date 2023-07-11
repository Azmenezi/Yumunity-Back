const { model, Schema } = require("mongoose");

const CategorySchema = new Schema({
  name: { type: String, required: true, lowercase: true, unique: true },
  addedBy: { type: Schema.Types.ObjectId, ref: "User" },
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

module.exports = model("Category", CategorySchema);
