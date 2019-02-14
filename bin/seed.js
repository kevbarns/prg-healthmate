require("dotenv").config();
const mongoose = require("mongoose");
// RUN CMD : node run seed
// MODELS
const Recipes = require("../models/recipes-model.js");
const DietData = require("../models/diet-data-model.js");
// DATA
const dietData = require("./dietData.json");
const recipesData = require("./recipesData.json");

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

Recipes.insertMany(recipesData)
  .then(recipeResults => {
    console.log(`${recipeResults.length} Recipes added to the database`);
  })
  .catch(err => {
    console.log("Failed to insert Recipes Data in the Recipes Collection", err);
  });

DietData.insertMany(dietData)
  .then(recipeResults => {
    console.log(`${recipeResults.length} Recipes added to the database`);
  })
  .catch(err => {
    console.log("Failed to insert Recipes Data in the Recipes Collection", err);
  });
