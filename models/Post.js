const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 2, maxlength: 55 },
    body: { type: String, required: true, minlength: 2, maxlength: 1000 },
    votes: { type: Number, default: 0 },
    subreddit: { type: String, minlength: 2, maxlength: 30},
    username: {type: String, required: true},
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    timestamps: true,
    createdAt: "publishedAt",
  } // going to add createdAt, updatedAt
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
