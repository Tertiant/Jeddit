const express = require("express");
const router = express.Router();
const database = require("../models/fake-db");
const checkAuth = require("../middleware/checkAuth");

router.get("/create", checkAuth.ensureAuthenticated, (req, res) => {
      res.render("posts/createPost", {req});
});

router.post("/create", checkAuth.ensureAuthenticated, (req, res) => {
  const {title, link, description, subgroup} = req.body;
  if (link.length > 0 && description.length > 0) {
  const post = database.addPost(title, link, req.user.id, description, subgroup);
  res.redirect(`/posts/show/:${post.id}`);
  } else {
    res.redirect("../");
  }
});

router.get("/show/:postID", (req, res) => {
  const postID = req.url.slice(7,req.url.length);
  const post = database.getPost(postID)
  res.render("posts/singlePost", { post, req });
});

router.get("/edit/:postID", checkAuth.ensureAuthenticated, (req, res) => {
  const postID = req.url.slice(7,req.url.length);
  const post = database.getPost(postID)
  res.render("posts/editPost", { post, req });
});

router.post("/edit/:postID", checkAuth.ensureAuthenticated, (req, res) => {
  const postID = req.url.slice(7,req.url.length);
  const {title, link, description, subgroup} = req.body;
  const post = database.editPost(postID, {"title":title, "link":link, "description":description, "subgroup":subgroup});
  res.redirect(`/posts/show/:${post.id}`);
});

router.post("/comment-create/:postID", checkAuth.ensureAuthenticated, (req, res) => {
  const postID = req.url.slice(17,req.url.length);
  const {description} = req.body;
  if (description.length > 0) {
    database.addComment(postID, req.user.id, description)
  };
  res.redirect(`/posts/show/:${postID}`);
});

router.get("/deleteConfirm/:postID", checkAuth.ensureAuthenticated, (req, res) => {
  const postID = req.url.slice(16,req.url.length);
  const post = database.getPost(postID)
  if (post.creator === req.user.id) {
    res.render("posts/deleteConfirm", { post, req });
  } else {
    res.redirect(`/posts/show/:${postID}`);
  }
});

router.post("/delete/:postID", checkAuth.ensureAuthenticated, (req, res) => {
  const postID = req.url.slice(9,req.url.length);
  const post = database.getPost(postID)
  database.deletePost(postID);
  res.redirect(`/subs/show/:${post.subgroup}`)
});



module.exports = router;