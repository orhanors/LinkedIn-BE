const ApiError = require("../classes/ApiError");
const mongoose = require("mongoose");
const db = require("../models");
const { User, Experience } = require("../models");

const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGODB_URI;
const { Transform } = require("json2csv");
const { pipeline } = require("stream");
const { join } = require("path");
const { createReadStream, writeJSON, remove } = require("fs-extra");

exports.experienceGetCsv = async (req, res, next) => {
	try {
		const userExperiences = await db.User.findOne(
			{ _id: req.params.userId },
			{ experiences: 1, _id: 0 }
		).populate("experiences");

		const path = join(__dirname, "../../csv.json");
		await writeJSON(path, userExperiences.experiences);

		const jsonReadableStream = createReadStream(path);

		const json2csv = new Transform({
			fields: ["company", "description", "area"],
		});

		res.setHeader("Content-Disposition", "attachment; filename=export.csv");
		pipeline(jsonReadableStream, json2csv, res, (err) => {
			if (err) {
				console.log("stream err:", err);
				next(err);
			} else {
				console.log("res", res);
				console.log("Done");
			}
		});

		await remove(path);
	} catch (error) {
		console.log("Csv export error: ", error);
		next(error);
	}
};

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

		res.status(200).json({
			data: `Experience # ${req.params.expId} deleted`,
		});
	} catch (error) {
		console.log("Experience DELETE controller error: ", error);
		next(error);
	}
};

exports.experienceGetAll = async (req, res, next) => {
	try {
		const findUser = await db.User.findOne({
			_id: req.params.userId,
		}).populate("experiences");
		res.status(200).json({ data: findUser });
	} catch (error) {
		console.log("Experience GETALL controller error: ", error);
		next(error);
	}
};

exports.experienceGetById = async (req, res, next) => {
	try {
		const findExperience = await db.Experience.findById({
			_id: req.params.expId,
		});
		res.status(200).json({ data: findExperience });
	} catch (error) {
		console.log("Experience GET controller error: ", error);
		next(error);
	}
};

exports.experiencePut = async (req, res, next) => {
	try {
		const findExperience = await db.Experience.findByIdAndUpdate(
			req.params.expId,
			req.body
		);
		if (findExperience) res.status(200).json({ data: findExperience });
		else throw new ApiError(404, "Experience");
	} catch (error) {
		console.log("Experience PUT controller error: ", error);
		next(error);
	}
};

exports.experienceUploadImage = async (req, res, next) => {
	try {
		const { expId } = req.params;

		const updatedExperience = await db.Experience.findOneAndUpdate(
			{ _id: expId },
			{ $set: { image: req.file.path } },
			{ new: true }
		);
		console.log("updated user", updatedExperience);
		if (!updatedExperience) throw new ApiError(404, "User");
		res.status(201).json({ data: "OK" });
	} catch (error) {
		console.log("Profile Image Upload error: ", error);
		next(error);
	}
};
