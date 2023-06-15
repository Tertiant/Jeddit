const express = require("express");
const passport = require("../middleware/passport");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/login", checkAuth.forwardAuthenticated, (req, res) => {
  res.render("login", {req});
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
