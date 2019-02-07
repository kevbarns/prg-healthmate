const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
  {
    title: {type: String, required: true, unique: true},
    image: {type: String, required: true},
    dishType: {
      type: String,
      required: true,
      enum: ["Breakfast", "Dish"]
    },
    kCal: {type: Number, required: true},
    protein: {type: Number, required: true},
    carbs: {type: Number, required: true},
    lip: {type: Number, required: true},
    prepTime: {type: Number, required: true},
    cookType: {type: Number, required: true},
    ingredients: [{type: String, required: true}]
  },
  {
    timestamps: true
  }
);

const Recipes = mongoose.model("Recipes", RecipeSchema);
module.exports = Recipes;
