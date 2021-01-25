const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		username: { type: String },
		bio: { type: String },
		title: { type: String },
		area: { type: String },
		image: { type: String },
		experiences:[{type:mongoose.Schema.Types.ObjectId ,ref="Experience"}]
	},
	{ timestamp: true }
);

/**
 * Enyrcyp user password before saving DB
 */
userSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		console.log("Bcryp hash error: ", error);
		next(error);
	}
});

/**
 * Checks entered password and hashed password in DB
 * returns boolean
 * @param {String} enteredPassword
 */
userSchema.methods.isValidPassword = async function (enteredPassword) {
	try {
		return await bcrypt.compare(enteredPassword, this.password);
	} catch (error) {
		console.log("Bcrypt password check error: ", error);
		next(error);
	}
};

const User = mongoose.model("User", userSchema);

module.exports = User;
