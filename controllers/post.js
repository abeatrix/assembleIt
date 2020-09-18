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

        res.render("/", context);
    } catch (error) {
        res.send(error);
    }
  });

// new route
router.get("/newPost", (req, res) => {
    try {
        res.render("/newPost");
    } catch (error) {
        res.send(error);
    }
  });

// create route
  router.post("/", async function (req, res) {
    try {
    //   const createdPost = await db.Post.create(req.body);
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
  
module.exports = router;