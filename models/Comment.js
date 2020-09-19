const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true },
    votes: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // comments: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }
  },
  {
    timestamps: true,
    createdAt: "publishedAt",
  } // going to add createdAt, updatedAt
);

const Comment = mongoose.model("Post", commentSchema);

module.exports = Comment;
