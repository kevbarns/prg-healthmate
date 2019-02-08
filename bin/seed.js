require("dotenv").config();

const mongoose = require("mongoose");

// OUR MODELS

const Recipes = require("../models/recipes.js");
// const UserData = require("../models/user-data.js");
// const UserProfil = require("../models/user-profile.js");
// const User = require("../models/user.js");

// NEED TO REQUIERE JSON FILE
// const recipesData

mongoose
  .connect("mongodb://localhost/myhealthmate", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

Recipes.insertMany(recipeData)
  .then(recipeResults => {
    console.log(`${recipeResults.length} Recipes added to the database !`);
  })
  .catch(err => {
    console.log(
      "An error has occured... Recipes couldn't been added to the database..."
    );
  });
