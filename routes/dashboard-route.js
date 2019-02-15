const express = require("express");
const router = express.Router();

const Recipes = require("../models/recipes-model.js");
const User = require("../models/user-model.js");
const UserData = require("../models/user-data-model.js");
const getMacro = require("../lib/get-macro.js");
const findUserRecipes = require("../lib/findUserRecipes.js");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/signup-login");
  }
}

router.use("/", (req, res, next) => {
  const userId = req.user._id;
  res.locals.layout = "dashboard/dashboard-layout.hbs";
  next();
});

router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  res.render("dashboard/dashboard-index.hbs");
});

router.get("/recipes-list", ensureAuthenticated, (req, res, next) => {
  const userId = req.user._id;
  Recipes.find()
    .then(recipesResult => {
      UserData.find({ userId: { $eq: userId } })
        .populate("dietReference.data")
        .then(userData => {
          // res.json(userData);
          const userMacros = getMacro(userData);
          res.locals.userMacros = userMacros;
          res.locals.userData = userData[0];
          res.locals.dietData = userData[0].dietReference[0].data;
          res.locals.recipesList = recipesResult;
          res.render("dashboard/recipes-list.hbs");
        })
        .catch(err => next(err));
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
      UserData.find({ userId: { $eq: req.user._id } })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate("dietReference.data")
        .then(userData => {
          // res.json(userData);
          const userMacros = getMacro(userData);
          res.locals.userMacros = userMacros;
          res.locals.userData = userData[0];
          res.locals.dietData = userData[0].dietReference[0].data;
          res.locals.userFavorites = data.favorites;
          res.render("dashboard/favorite-recipe.hbs");
        })
        .catch(err => next());
    });
});

router.get("/make-my-day", (req, res, next) => {
  const userId = req.user._id;
  Recipes.find()
    .then(recipesList => {
      UserData.findOne({ userId: { $eq: userId } })
        .then(userData => {
          // call function
          const dailyRecipes = findUserRecipes(recipesList, userData);
          Recipes.find({ _id: { $in: dailyRecipes } })
            .then(results => {
              // res.json(results);
              res.locals.recipes = results;
              res.render("dashboard/myrecipes.hbs");
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;
