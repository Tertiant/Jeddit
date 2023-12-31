const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");
const userController = require("../controllers/userController");

const localLogin = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  (username, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(username, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin);
