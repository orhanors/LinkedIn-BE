const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: { type: String },
    username: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{
      
      userId: { type: mongoose.Schema.Types.ObjectId, ref:"User",   
      unique: true
    }
    }, { timestamps: true }],
    image: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fvolltext.net%2Ftexte%2Ffelix-philipp-ingold-kerker-klinik-und-klausur%2Farthur-schopenhauer-c-j-schaefer%2F&psig=AOvVaw31wdbiDhOy6gzb5Vzf1n9l&ust=1611739791117000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOCxsOGkue4CFQAAAAAdAAAAABAP",
    },
  },
  { timestamps: true }
)


const Post = mongoose.model("Post", postSchema);

module.exports = Post;
