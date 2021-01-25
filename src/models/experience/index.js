const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
	{
		role: { type: String },
		company: { type: String },
		startDate: { type: Date, default: Date.now },
		endDate: { type: Date, default: Date.now },
		description: { type: String },
		area: { type: String },
		image: { type: String },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;
