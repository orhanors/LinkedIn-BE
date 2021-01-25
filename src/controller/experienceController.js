const ApiError = require("../classes/ApiError")
const db = require("../models")
exports.experiencePost = async (req, res, next) => {
    try {
        const { userId } = req.params
        const foundUser = await db.User.findById(userId)
        if (!foundUser) throw new ApiError(404, "User") 
        const newExperience = await new db.Experience(req.body)
        await newExperience.save()
        
        const editedUser = await db.findByIdAndUpdate(userId,{$push:{experiences:newExperience._id}})
        res.status(201).json({ data: newExperience })
    } catch (error) {
        console.log("Post controller error", error)
        next(error)
    }
}