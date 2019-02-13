const express = require("express");
const router = express.Router();

const Recipes = require("../models/recipes-model.js");

router.use("/", (req, res, next) => {
  res.locals.layout = "dashboard/dashboard-layout.hbs";
  next();
});

router.get("/recipes-list", (req, res, next) => {
  Recipes.find()
    .then(recipesResult => {
      console.log("Recipes added");
      res.locals.recipesList = recipesResult;
      res.render("dashboard/recipes-list.hbs");
    })
    .catch(err => next(err));
});

router.get("/oneRecipe/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  Recipes.findById(recipeId)
    .then(recipeData => {
      res.locals.oneRecipe = recipeData;
      res.render("dashboard/oneRecipe.hbs");
    })
    .catch(err => next(err));
});

router.get("/favorite-recipe", (req, res, next) => {
  res.render("dashboard/favorite-recipe.hbs");
});

module.exports = router;
