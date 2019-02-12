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

module.exports = router;
