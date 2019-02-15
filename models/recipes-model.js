const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoolia = require("mongoolia").default;

const RecipeSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, algoliaIndex: true },
    image: { type: String, required: true },
    dishType: {
      type: String,
      required: true,
      algoliaIndex: true,
      enum: ["Breakfast", "Dish"]
    },
    kCal: { type: Number, required: true, algoliaIndex: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    lipid: { type: Number, required: true },
    prepTime: { type: Number, required: true },
    cookingTime: { type: Number, required: true },
    ingredientList: [{ type: String, required: true, algoliaIndex: true }]
  },
  {
    timestamps: true
  }
);

RecipeSchema.plugin(mongoolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_KEY,
  indexName: "search_data"
});

const Recipes = mongoose.model("Recipes", RecipeSchema);
module.exports = Recipes;
