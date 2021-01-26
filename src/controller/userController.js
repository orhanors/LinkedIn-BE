const ApiError = require("../classes/ApiError");
const { signJWT } = require("../helpers/jwt");
const db = require("../models");

//AUTH
exports.signup = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const foundUser = await db.User.findOne({ email });

		if (foundUser) throw new ApiError(400, "Email already exist");

		const newUser = new db.User({ ...req.body });
		await newUser.save();

		const token = signJWT(newUser); //This is gonna generate a token which contains user ID
		res.status(201).json({ token });
	} catch (error) {
		console.log("Signup controller error", error);
		next(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		//Passport middleware adds req.user
		const token = signJWT(req.user);
		res.status(201).json({ token, user: req.user });
	} catch (error) {
		console.log("Login controller error", error);
		next(error);
	}
};

//PROFILE
exports.profileGetAll = async (req, res, next) => {
	try {
		const allProfiles = await db.User.find({}, { password: 0 });
		res.status(200).json({ data: allProfiles });
	} catch (error) {
		console.log("Profile GETALL controller error", error);
		next(error);
	}
};

exports.profileGetSingle = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const foundProfile = await db.User.findById(userId, {
			password: 0,
		}).populate("experiences");
		if (!foundProfile) throw new ApiError(404, "User");
		res.status(200).json({ data: foundProfile });
	} catch (error) {
		console.log("Profile GETSINGLE controller error", error);
		if (error.name == "CastError") return next(new ApiError(404, "User"));
		next(error);
	}
};

exports.profileEdit = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const editedProfile = await db.User.findByIdAndUpdate(
			userId,
			{
				$set: { ...req.body },
			},
			{ new: true }
		);

		console.log("edited profile", editedProfile);
		res.status(201).json({ data: editedProfile });
	} catch (error) {
		console.log("Profile PUT controller error", error);
		if (error.name === "CastError") return next(new ApiError(404, "User"));
		next(error);
	}
};

exports.profileDelete = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const deletedProfile = await db.User.findByIdAndDelete(userId);
		if (!deletedProfile) throw new ApiError(404, "User");
		//TODO DELETE ALSO RELATED EXPERINCES
		console.log("deleted Progile", deletedProfile);

		const deletedExps = await db.Experience.deleteMany({
			_id: { $in: deletedProfile.experiences },
		});
		res.status(200).json({ data: "Successfully deleted" });
	} catch (error) {
		console.log("Profile DELETE controller error", error);
		if (error.name === "CastError") return next(new ApiError(404, "User"));
		next(error);
	}
};

exports.profileUploadImage = async (req, res, next) => {
	try {
		const { userId } = req.params;

		const updatedUser = await db.User.findOneAndUpdate(
			{ _id: userId },
			{ $set: { image: req.file.path } },
			{ new: true }
		);
		console.log("updated user", updatedUser);
		if (!updatedUser) throw new ApiError(404, "User");
		res.status(201).json({ data: updatedUser });
	} catch (error) {
		console.log("Profile Image Upload error: ", error);
		next(error);
	}
};
