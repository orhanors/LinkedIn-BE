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
    const posts = await db.Post.find()
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
    const post = await db.Post.findById(req.params.postId).populate("user")
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
  } catch (error) {
    console.log(error)
  }
}
// - GET https://yourapi.herokuapp.com/api/posts/
// Retrieve posts
// - POST https://yourapi.herokuapp.com/api/posts/
// Creates a new post  DONE
// - GET https://yourapi.herokuapp.com/api/posts/{postId}
// Retrieves the specified post
// - PUT https://yourapi.herokuapp.com/api/posts/{postId}
// Edit a given post
// - DELETE https://yourapi.herokuapp.com/api/posts/{postId}
// Removes a post
// - POST https://yourapi.herokuapp.com/api/posts/{postId}
// Add an image to the post under the name of "post"
// #EXTRA: Find a way to return also the user with the posts, in order to have the Name / Picture to show it correcly on the frontend
