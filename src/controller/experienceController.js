const ApiError = require("../classes/ApiError")
const mongoose = require("mongoose")
const db = require("../models")
const e = require("express")
exports.experiencePost = async (req, res, next) => {
  try {
    const { userId } = req.params
    const foundUser = await db.User.findById(userId)
    if (!foundUser) throw new ApiError(404, "User")
    const newExperience = await new db.Experience(req.body)
    newExperience.user = foundUser._id
    await newExperience.save()

    const editedUser = await db.User.findByIdAndUpdate(userId, {
      $push: { experiences: newExperience._id },
    })
    res.status(201).json({ data: newExperience })
  } catch (error) {
    console.log("Post controller error", error)
    next(error)
  }
}

exports.getExperience = async (req, res, next) => {
  try {
    const user = await db.User.findById(req.params.userId, {}).populate({
      path: "experiences",
    })

    let experience = {}
    const experiences = user.experiences
    const expId = req.params.expId

    for (let i = 0; i < experiences.length; i++) {
      if (experiences[i]._id.toString() === expId.toString()) {
        experience = JSON.parse(JSON.stringify(experiences[i]))
      } else {
        console.log("experience not found")
      }
    }
    res.send({ data: experience })
  } catch (error) {
    console.log("Experience DELETE controller error: ", error)
    next(error)
  }
}

exports.experienceDelete = async (req, res, next) => {
  try {
    const editedUser = await db.User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      { $pull: { experiences: req.params.expId } }
    )

    res.status(200).json({ data: "OK" })
  } catch (error) {
    console.log("Experience DELETE controller error: ", error)
    next(error)
  }
}

// EXPERIENCE:
// - GET https://yourapi.herokuapp.com/api/profile/userName/experiences
// Get user experiences
// - POST https://yourapi.herokuapp.com/api/profile/userName/experiences
// Create an experience.
// - GET https://yourapi.herokuapp.com/api/profile/userName/experiences/:expId
// Get a specific experience
// - PUT https://yourapi.herokuapp.com/api/profile/userName/experiences/:expId
// Get a specific experience
// - DELETE https://yourapi.herokuapp.com/api/profile/userName/experiences/:expId
// Get a specific experience
// - POST https://yourapi.herokuapp.com/api/profile/userName/experiences/:expId/picture
// Change the experience picture
// - POST https://yourapi.herokuapp.com/api/profile/userName/experiences/CSV
// Download the experiences as a CSV
