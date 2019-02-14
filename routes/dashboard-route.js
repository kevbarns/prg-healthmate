const express = require("express");
const router = express.Router();

const Recipes = require("../models/recipes-model.js");
const User = require("../models/user-model.js");
const UserData = require("../models/user-data-model.js");

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

router.get("/dashboard-index", ensureAuthenticated, (req, res, next) => {
  res.render("dashboard/dashboard-index.hbs");
});

router.get("/recipes-list", ensureAuthenticated, (req, res, next) => {
  const userId = req.user._id;
  Recipes.find()
    .then(recipesResult => {
      UserData.find({userId: {$eq: userId}})
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
  const {recipeId} = req.params;

  Recipes.findById(recipeId)
    .then(recipeData => {
      res.locals.oneRecipe = recipeData;
      res.render("dashboard/oneRecipe.hbs");
    })
    .catch(err => next(err));
});

router.get("/add-fav-recipe/:recipeId", (req, res, next) => {
  const {recipeId} = req.params;

  const isFavorited = req.user.favorites.some(oneId => {
    return oneId.recipes.toString() === recipeId.toString();
  });
  console.log(isFavorited);
  if (isFavorited === true) {
    res.redirect(`/oneRecipe/${recipeId}`);
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      {$push: {favorites: {recipes: recipeId}}},
      {runValidators: true}
    )
      .then(data => {
        res.redirect(`/oneRecipe/${recipeId}`);
      })
      .catch(err => next(err));
  }
});

router.get("/delete-fav-recipe/:recipeId", (req, res, next) => {
  const {recipeId} = req.params;

  User.findByIdAndUpdate(
    req.user._id,
    {$pull: {favorites: {recipes: recipeId}}},
    {runValidators: true}
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

function getMacro(data) {
  const protein = data[0].dietReference[0].data.protein,
    lipid = data[0].dietReference[0].data.lipid,
    carbs = data[0].dietReference[0].data.carbs,
    objectiveNeed = data[0].objectiveNeed;

  userProtein = Math.round((objectiveNeed * protein) / 100 / 4);
  userLipid = Math.round((objectiveNeed * lipid) / 100 / 4);
  userCarbs = Math.round((objectiveNeed * carbs) / 100 / 9);

  return {userProtein, userLipid, userCarbs};
}

function findUserRecipes(recipesList) {
  // foreach recipes
  // while (userProtein <= recipesList.protein) 
  // if (userCarbs < recipesList.Carbs)
  // if (userLipid < recipesList.Lipid)
  // push(recipesList._id)
}
module.exports = router;
