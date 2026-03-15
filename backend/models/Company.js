const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
        },
        logo: {
            type: String, // URL to the logo
        },
        location: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
