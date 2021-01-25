const ApiError = require("../classes/ApiError")
const db = require("../models")
exports.experience = async (req, res, next) => {
    try {
        const { user } = req.body
        const foundUser = await db.User.findOne({ _id })
        if (foundUser) {
        const newExperience = await new db.Experience(req.body)
        await newExperience.save()
        } else {
        throw new ApiError(401, "User not found") //TODO check why it doesn't come out this message
        next()
        }
        res.status(201).json({ data: newExperience })
    } catch (error) {
        console.log("Post controller error", error)
        next(error)
    }
}