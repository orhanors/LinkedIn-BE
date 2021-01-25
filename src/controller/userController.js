const ApiError = require("../classes/ApiError");
const { signJWT } = require("../helpers/jwt");
const db = require("../models");

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
		res.status(201).json({ token });
	} catch (error) {
		console.log("Login controller error", error);
		next(error);
	}
};
