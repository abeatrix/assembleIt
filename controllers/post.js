const express = require("express");
const router = express.Router();

const db = require("../models");

// base route /

// Search route
router.get("/search", async (req, res) => {
  console.log(req.query.results)
  try {
    const results = await db.Post.find(
      { "title" : { $regex : new RegExp(req.query.results, "i") } }
    );
    console.log(results)
    const context = {
      results: results,

    };
    res.render("posts/search.ejs", context);
  } catch (error) {
    console.log(error)
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// subreddit index route
router.get("/r", async (req, res) => {
  try {
    const foundPosts = await db.Post.find({subreddit: req.params.subreddit});
    const allSubreddits = await db.Post.distinct("subreddit");
    const context = {
      posts: foundPosts,
      subreddits: allSubreddits,
    };
    res.render("posts/subs", context);
  } catch (error) {
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// subreddit show route
router.get("/r/:subreddit", async (req, res) => {
  try {
    const foundPosts = await db.Post.find({subreddit: req.params.subreddit});
    const allSubreddits = await db.Post.distinct("subreddit");
    const context = {
      posts: foundPosts,
      subreddits: allSubreddits,
    };
    res.render("posts/index.ejs", context);
  } catch (error) {
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// new route
router.get("/newPost", (req, res) => {
  try {
    const context = {
    }
    res.render("posts/new.ejs", context);
  } catch (error) {
    req.flash('error', "title mst be between 2-250 characters. body must be between 2-1000 characters. subreddit must be between 2-30 characters.");
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});


// new comment route
router.get("/:id/newComment", async (req, res) => {
  try {
    const postID = await db.Post.findById(req.params.id);
    const context = {
      user: req.session.currentUser,
      post: postID
    }
    res.render("comments/new.ejs", context);
  } catch (error) {
    req.flash('error', "comment must be between 2-1000 characters.");
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// Create comment route
router.post("/comments", async (req, res) => {
  try {
    const createdComment = await db.Comment.create(req.body);
    const foundUser = await db.User.findById(req.body.user);
    const foundPost = await db.Post.findById(req.body.post);

    foundUser.comments.push(createdComment);
    await foundUser.save();

    foundPost.comments.push(createdComment);
    await foundPost.save();

    res.redirect(`/posts/${foundPost.id}`);
  } catch (error) {
    console.log(error);
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// create route
router.post("/", async (req, res) => {
  try {
    const foundUser = await db.User.findById(req.body.user);
    const username = foundUser.username;
    req.body.username = username;
    const createdPost = await db.Post.create(req.body);

    foundUser.posts.push(createdPost);
    await foundUser.save();

    res.redirect(`/posts/r/${req.body.subreddit}`);
  } catch (error) {
    console.log(error);
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// show
router.get("/:id", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const allSubreddits = await db.Post.distinct("subreddit");
    const foundComments = [];
    for (let i = 0; i < foundPost.comments.length; i++) {
      const comment = await db.Comment.findById(foundPost.comments[i]);
      const user = await db.User.findById(comment.user);
      foundComments.push([comment, user]);
    }

    const context = {
      post: foundPost,
      subreddits: allSubreddits,
      user: req.session.currentUser,
      comments: foundComments,
    };
    res.render("posts/show", context);
  } catch (error) {
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const context = {
      post: foundPost,
      user: req.session.currentUser,
    };
    console.log(foundPost)
    res.render("posts/edit.ejs", context);
  } catch (error) {
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const foundPost = await db.Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/posts/${foundPost._id}`);
  } catch (error) {
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    // deletes post from OPs post history
    const foundPost = await db.Post.findById(req.params.id);
    const foundUser = await db.User.findById(foundPost.user);
    for (let i = 0; i < foundUser.posts.length; i++) {
      if (foundUser.posts[i] == req.params.id) {
        foundUser.posts.splice(i, 1);
        await foundUser.save();
      }
    }

    // deletes comments from commenters history
    const foundComments = foundPost.comments;
    for (let i = 0; i < foundComments.length; i++) {
      const singleComment = await db.Comment.findById(foundComments[i]);
      const userComment = await db.User.findById(singleComment.user);
      const length = userComment.comments.length;
      for(let j=0; j < length; j++){
        if(foundComments[i] == userComment.comments[j]){
          userComment.comments.splice(j,1);
          await userComment.save();
        }
      }
    }

    await db.Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});


// upvote route
router.get("/:id/up", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const foundUser = await db.User.findById(foundPost.user);

    for(let i = 0; i < foundPost.downvotes.length; i++){
      if(req.session.currentUser.id == foundPost.downvotes[i]){
        foundPost.downvotes.splice(i,1);
        await foundPost.save();
        foundUser.karma++;
        await foundUser.save();
      }
    }
    foundPost.upvotes.push(req.session.currentUser.id);
    await foundPost.save();

    foundUser.karma++;
    await foundUser.save();

    const totalVotes = foundPost.upvotes.length - foundPost.downvotes.length;
    foundPost.votes = totalVotes;
    await foundPost.save();

    res.json(foundPost);
  } catch (error) {
      console.log(error)
      req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }
});

// downvote route
router.get("/:id/down", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const foundUser = await db.User.findById(foundPost.user);

    for(let i = 0; i < foundPost.upvotes.length; i++){
      if(req.session.currentUser.id == foundPost.upvotes[i]){
        foundPost.upvotes.splice(i,1);
        await foundPost.save();
        foundUser.karma--;
        await foundUser.save();
      }
    }
    foundPost.downvotes.push(req.session.currentUser.id);
    await foundPost.save();

    foundUser.karma--;
    await foundUser.save();

    const totalVotes = foundPost.upvotes.length - foundPost.downvotes.length;
    foundPost.votes = totalVotes;
    await foundPost.save();

    res.json(foundPost);
  } catch {
    console.log(error)
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }

});

// even route
router.get("/:id/even", async (req, res) => {
  try {
    const foundPost = await db.Post.findById(req.params.id);
    const foundUser = await db.User.findById(foundPost.user);


    for(let i = 0; i < foundPost.upvotes.length; i++){
      if(req.session.currentUser.id == foundPost.upvotes[i]){
        foundPost.upvotes.splice(i,1);
        await foundPost.save();
        foundUser.karma--;
        await foundUser.save();
      }
    }
    for(let i = 0; i < foundPost.downvotes.length; i++){
      if(req.session.currentUser.id == foundPost.downvotes[i]){
        foundPost.downvotes.splice(i,1);
        await foundPost.save();
        foundUser.karma++;
        await foundUser.save();
      }
    }

    const totalVotes = foundPost.upvotes.length - foundPost.downvotes.length;
    foundPost.votes = totalVotes;
    await foundPost.save();

    res.json(foundPost);
  } catch {
    console.log(error)
    req.flash('error', error);
    return res.redirect("404");                                                          // redirect to 404 Page if there is an error
  }

});

module.exports = router;
