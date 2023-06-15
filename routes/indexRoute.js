const express = require("express");
const router = express.Router();
const database = require("../models/fake-db");

// { id: 5, uname: 'jim', password: 'jim', role: 'admin' }

router.get("/", (req, res) => {
  res.redirect("/home");
}); 

router.get("/home", (req, res) => {
    const posts = database.getPosts(20);
    res.render("home", { posts, req });
});

module.exports = router;
