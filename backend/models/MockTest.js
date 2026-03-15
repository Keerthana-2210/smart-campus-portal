const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        durationMinutes: {
            type: Number,
            required: true,
        },
        passingScore: {
            type: Number,
            default: 50,
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MockTest", mockTestSchema);