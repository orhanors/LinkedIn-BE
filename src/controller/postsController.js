const ApiError = require("../classes/ApiError")
const db = require("../models")

exports.post = async (req, res, next) => {
  try {
    const { user } = req.body
    const foundUser = await db.User.findById(user)
    console.log(foundUser)
    if (!foundUser) {
      throw new ApiError(401, "User not found")
    } else {
      const newPost = await new db.Post(req.body)
      await newPost.save()
      res.status(201).json({ data: newPost })
    }
  } catch (error) {
    console.log("Post controller error", error)
    next(error)
  }
}

exports.get = async (req, res) => {
  try {
    const posts = await db.Post.find().populate({
      path: "user",
      select: ["name", "surname", "image"],
    })
    if (posts) {
      if (posts.length > 0) {
        res.status(201).json({ data: posts })
      } else {
        console.log("there are no posts ")
      }
    } else {
      throw new ApiError(401, "Posts not found")
    }
  } catch (error) {}
}

exports.getSinglePost = async (req, res) => {
  try {
    const post = await db.Post.findById(req.params.postId).populate({
      path: "user",
      select: ["name", "surname", "image"],
    })
    if (!post) {
      throw new ApiError(401, "Post not found")
    } else {
      res.status(201).json({ data: post })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.modifyPost = async (req, res, next) => {
  try {
    const modifiedPost = await db.Post.findByIdAndUpdate(
      req.params.postId,
      req.body
    )
    if (!modifiedPost) {
      throw new ApiError(401, "Post not found")
    } else {
      res.status(201).json({ data: modifiedPost })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const deletePost = await db.Post.findByIdAndDelete(req.params.postId)
    if (deletePost) {
      res.status(203).send("Post deleted")
    } else {
      throw new ApiError(401, "Post not found")
    }
  } catch (error) {
    console.log(error)
  }
}

exports.postImage = async (req, res, next) => {
  try {
    const post = await db.Post.findById(req.params.postId)
    if (!post) {
      throw new ApiError(401, "Post not found")
    } else {
      post.image = req.file.path
      await post.save()
      res.status(201).send({ data: post })
    }
  } catch (error) {
    console.log(error)
  }
}
