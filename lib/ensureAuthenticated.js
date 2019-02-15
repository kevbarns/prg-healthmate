function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/signup-login");
  }
}

module.exports = ensureAuthenticated;
