const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		comment: { type: String },
		postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
