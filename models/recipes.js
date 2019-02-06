const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    dishType: {
      type: String,
      required: true,
      enum: ["Breakfast", "Dish"]
    },
    kCal: { type: number, required: true },
    protein: { type: number, required: true },
    carbs: { type: number, required: true },
    lip: { type: number, required: true },
    prepTime: { type: number, required: true },
    cookType: { type: number, required: true },
    ingredients: [{ type: String, required: true }]
  },
  {
    timestamps: true
  }
);

const Recipes = mongoose.model("Recipes", recipeSchema);
module.exports = Recipes;
