const ApiError = require("../classes/ApiError")
const mongoose = require("mongoose")
const db = require("../models")
const { User, Post, Comment, Like } = require("../models")

exports.commentGet = async (req, res, next) => {
  try {
    const findPost = await db.Post.findOne({
      _id: req.params.postId,
    }).populate({ path: "comments", populate: { path: "userId" } })
    res.status(200).json({ data: findPost })
  } catch (error) {
    console.log("Comments GET controller error: ", error)
    next(error)
  }
}

exports.commentPost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const foundPost = await db.Post.findById(postId)
    if (!foundPost) throw new ApiError(404, "Post")
    const newComment = await new db.Comment(req.body)
    newComment.postId = foundPost._id
    await newComment.save()
    const editedPost = await db.Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    })
    res.status(201).json({ data: newComment })
  } catch (error) {
    console.log("Comments POST controller error: ", error)
    next(error)
  }
}

exports.commentPut = async (req, res, next) => {
  try {
    const findComment = await db.Comment.findByIdAndUpdate(
      req.params.commentId,
      req.body
    )
    console.log(findComment)
    //if (findComment)
    res.status(200).json({ data: findComment })
    //else throw new ApiError(404, "Comment");
  } catch (error) {
    console.log("Comments PUT controller error: ", error)
    next(error)
  }
}

exports.commentDelete = async (req, res, next) => {
  try {
    const editedComment = await db.Post.findOneAndUpdate(
      {
        _id: req.params.postId,
      },
      { $pull: { comments: req.params.commentId } }
    )
    res.status(200).json({
      data: `Comment # ${req.params.commentId} deleted`,
    })
  } catch (error) {
    console.log("Comments DELETE controller error: ", error)
    next(error)
  }
}

exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const { userId } = req.body
    const foundPost = await db.Post.findByIdAndUpdate(postId, {
      $push: {
        likes: userId,
      },
    })
    res.status(201).send(foundPost)
  } catch (error) {
    console.log("Comments LIKE POST controller error: ", error)
    next(error)
  }
}

exports.likeDelete = async (req, res, next) => {
  try {
    const editedLikes = await db.Post.findByIdAndUpdate(
      {
        _id: req.params.postId,
      },
      { $pull: { likes: { _id: req.params.likeId } } }
    )
    res.status(200).json({
      data: `Likes #deleted`,
    })
  } catch (error) {
    console.log("Comments LIKE DELETE controller error: ", error)
    next(error)
  }
}
