const express = require("express");
const router = express.Router();

const Recipes = require("../models/recipes-model.js");
const User = require("../models/user-model.js");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/signup-login");
  }
}

router.use("/", (req, res, next) => {
  res.locals.layout = "dashboard/dashboard-layout.hbs";
  next();
});

router.get("/recipes-list", ensureAuthenticated, (req, res, next) => {
  Recipes.find()
    .then(recipesResult => {
      console.log("Recipes added");
      res.locals.recipesList = recipesResult;
      res.render("dashboard/recipes-list.hbs");
    })
    .catch(err => next(err));
});

router.get("/oneRecipe/:recipeId", ensureAuthenticated, (req, res, next) => {
  const { recipeId } = req.params;

  Recipes.findById(recipeId)
    .then(recipeData => {
      res.locals.oneRecipe = recipeData;
      res.render("dashboard/oneRecipe.hbs");
    })
    .catch(err => next(err));
});

router.get("/add-fav-recipe/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  const isFavorited = req.user.favorites.some(oneId => {
    return oneId.recipes.toString() === recipeId.toString();
  });
  console.log(isFavorited);
  if (isFavorited === true) {
    res.redirect(`/oneRecipe/${recipeId}`);
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      { $push: { favorites: { recipes: recipeId } } },
      { runValidators: true }
    )
      .then(data => {
        res.redirect(`/oneRecipe/${recipeId}`);
      })
      .catch(err => next(err));
  }
});

router.get("/delete-fav-recipe/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: { recipes: recipeId } } },
    { runValidators: true }
  )
    .then(data => {
      res.redirect("/favorite-recipe");
    })
    .catch(err => next(err));
});

router.get("/favorite-recipe", ensureAuthenticated, (req, res, next) => {
  User.findById(req.user._id)
    .populate("favorites.recipes")
    .then(data => {
      res.locals.userFavorites = data.favorites;
      res.render("dashboard/favorite-recipe.hbs");
    });
});

module.exports = router;
