const ApiError = require("../classes/ApiError");
const mongoose = require("mongoose");
const db = require("../models");
exports.experiencePost = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const foundUser = await db.User.findById(userId);
		if (!foundUser) throw new ApiError(404, "User");
		const newExperience = await new db.Experience(req.body);
		newExperience.user = foundUser._id;
		await newExperience.save();

		const editedUser = await db.User.findByIdAndUpdate(userId, {
			$push: { experiences: newExperience._id },
		});
		res.status(201).json({ data: newExperience });
	} catch (error) {
		console.log("Post controller error", error);
		next(error);
	}
};

exports.experienceDelete = async (req, res, next) => {
	try {
		const editedUser = await db.User.findOneAndUpdate(
			{
				_id: req.params.userId,
			},
			{ $pull: { experiences: req.params.expId } }
		);

		res.status(200).json({ data: "OK" });
	} catch (error) {
		console.log("Experience DELETE controller error: ", error);
		next(error);
	}
};