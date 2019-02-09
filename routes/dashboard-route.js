const express = require("express");
const router = express.Router();

router.use("/", (req, res, next) => {
  res.locals.layout = "dashboard/dashboard-layout.hbs"
  next();
});

router.get("/", (req, res, next) => {
  res.render("dashboard/recipes-list.hbs");
});

module.exports = router;
