const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, minlength: 2, maxlength: 1000 },
    votes: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
    // replies: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }
  },
  {
    timestamps: true,
    createdAt: "publishedAt",
  } // going to add createdAt, updatedAt
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
