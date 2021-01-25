const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    text: { type: String },
    username: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String },
  },
  { timestamps: true }
)

const Post = mongoose.model("Post", postSchema)

module.exports = Post

// "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg",
