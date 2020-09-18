const express = require("express");
const router = express.Router();

const db = require("../models");

// base route /

// index route
router.get("/", async (req, res) => {
  try {
    const foundPosts = await db.Post.find({});
    const context = {
      posts: foundPosts
    };
    res.render("posts/index.ejs", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// new route
router.get("/newPost", (req, res) => {
  try {
    res.render("posts/new.ejs");
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// create route
router.post("/", async (req, res) => {
  try {
    await db.Post.create(req.body);
    //   TODO user created posts
    //   const user = await db.User.findById(req.body.author);

    /* foundAuthor.articles.push(createdArticle);
    await foundAuthor.save(); */

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal server error" });
  }
});

// show
router.get("/:id", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const context = { post: foundPost };

    res.render("posts/show", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const context = { post: foundPost };
    res.render("posts/edit", context);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const foundPost = await db.Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/${foundPost._id}`);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    await db.Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

module.exports = router;