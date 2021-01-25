const mongoose = require("mongoose")


const experienceSchema = new mongoose.Schema(
    {   username: { type: String },
        role: { type: String },
        company: { type: String },
        startDate: { type: Date, default: Date.now},
        endDate: { type: Date, default: Date.now },
        description: { type: String },
        area: { type: String },
        image: { type: String }
    },
    { timestamps: true },
);

const Experience = mongoose.model("Experience", experienceSchema)

module.exports = Experience
