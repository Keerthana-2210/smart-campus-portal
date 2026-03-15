const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        stipend: {
            type: String,
            required: true,
        },
        eligibility: {
            type: String,
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
