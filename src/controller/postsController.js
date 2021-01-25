const ApiError = require("../classes/ApiError")
const db = require("../models")
exports.post = async (req, res, next) => {
  try {
    const { user } = req.body
    const foundUser = await db.User.findOne({ _id })
    if (foundUser) {
      const newPost = await new db.Post(req.body)
      await newPost.save()
    } else {
      throw new ApiError(401, "User not found") //TODO check why it doesn't come out this message
      next()
    }
    res.status(201).json({ data: newPost })
  } catch (error) {
    console.log("Post controller error", error)
    next(error)
  }
}

// - GET https://yourapi.herokuapp.com/api/posts/
// Retrieve posts
// - POST https://yourapi.herokuapp.com/api/posts/
// Creates a new post
// - GET https://yourapi.herokuapp.com/api/posts/{postId}
// Retrieves the specified post
// - PUT https://yourapi.herokuapp.com/api/posts/{postId}
// Edit a given post
// - DELETE https://yourapi.herokuapp.com/api/posts/{postId}
// Removes a post
// - POST https://yourapi.herokuapp.com/api/posts/{postId}
// Add an image to the post under the name of "post"
// #EXTRA: Find a way to return also the user with the posts, in order to have the Name / Picture to show it correcly on the frontend
