const express = require("express");
const router = express.Router();
const database = require("../models/fake-db")

router.get("/list", (req, res) => {
  const subsList = database.getSubs();
  res.render("subs", {req, subsList});
});

router.get("/show/:subname", (req, res) => {
  const sub = req.url.slice(7,req.url.length);
  const posts = database.getPosts(20, sub);
  res.render("sub", { posts, req, sub });
});

module.exports = router;