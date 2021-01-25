const mongoose = require("moongose")

const experienceSchema = new mongoose.Schema(
    {
        role: { type: String },
        company: { type: String },
        startDate: { type: new Date(year, month + 1, day) },
        endDate: { type: new Date(year, month + 1, day) },
        description: { type: String },
        area: { type: String },
        username: { type: String },
        image: { type: String }
    },
    { timestamps: true },
);

const Experience = mongoose.model("Experience", experienceSchema)

module.exports = Experience
