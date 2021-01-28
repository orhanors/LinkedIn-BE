const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema(
  {
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: "User",   
                unique: true
        }
    }, { timestamps: true }
)

const Like = mongoose.model("Like", likeSchema)

module.exports = Like