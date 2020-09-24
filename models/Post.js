const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    votes: { type: Number, default: 0 },
    subreddit: { type: String },
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
