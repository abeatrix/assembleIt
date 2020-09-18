const express = require("express");
const router = express.Router();

const db = require("../models");

// base route /

// index route
router.get("/", (req, res) => {
    try {
        const foundPosts = db.Post.find({});
        const context = {
            posts: foundPosts
        };

        res.render("posts/index", context);
    } catch (error) {
        res.send({ message: "Internal server error" });
    }
  });

// new route
router.get("/newPost", (req, res) => {
    try {
        res.render("posts/newPost");
    } catch (error) {
        res.send({ message: "Internal server error" });
    }
  });

// create route
  router.post("/", async function (req, res) {
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
router.get("/:id", function (req, res) {
    try {
        const foundPost = db.Post.findById(req.params.id);
        const context = {post: foundPost};

        res.render("posts/show", context);
    } catch (error) {
        res.send({ message: "Internal server error" });
    }
  });

// edit form
router.get("/:id/edit", function (req, res) {
    try {
        const foundPost = db.Post.findById(req.params.id);
        const context = {post: foundPost};
        res.render("posts/edit", context);
    } catch (error) {
        res.send({ message: "Internal server error" });
    }
  });

// update
router.put("/:id", function (req, res) {
    db.Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, updatedArticle) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        res.redirect(`/articles/${updatedArticle._id}`);
      }
    );

    try {
        const foundPost = db.Post.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.redirect(`/${foundPost._id}`);
    } catch (error) {
        res.send({ message: "Internal server error" });
    }
  });

module.exports = router;