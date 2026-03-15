const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mockTest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockTest",
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        totalPoints: {
            type: Number,
            required: true,
        },
        passed: {
            type: Boolean,
            required: true,
        },
        malpracticeCount: {
            type: Number,
            default: 0,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
