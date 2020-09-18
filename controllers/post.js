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

module.exports = router;