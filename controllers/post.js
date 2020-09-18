const express = require("express");
const router = express.Router();

const db = require("../models");

// base route r/

// index route
router.get("/", function (req, res) {
    db.Article.find({}, function (error, foundArticles) {
      if (error) return res.send(error);
  
      const context = {
        articles: foundArticles,
      };
  
      res.render("article/index", context);
    });
  });



module.exports = router;