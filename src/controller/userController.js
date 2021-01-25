const ApiError = require("../classes/ApiError");
const db = require("../models");
exports.signup = async (req, res, next) => {
	try {
		const { email } = req.body;
		const foundUser = await db.User.findOne({ email });

		if (foundUser) throw new ApiError(400, "Email already exist");

		const newUser = new db.User({ ...req.body });
		await newUser.save();
		res.status(201).json({ data: newUser });
	} catch (error) {
		console.log("Signup controller error", error);
		next(error);
	}
};
