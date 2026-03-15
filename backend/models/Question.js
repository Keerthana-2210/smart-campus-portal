const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        mockTest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockTest",
            required: true,
        },
        type: {
            type: String,
            enum: ["mcq", "coding"],
            required: true,
            default: "mcq",
        },
        // MCQ specific fields
        text: {
            type: String,
            required: true,
        },
        options: [
            {
                type: String,
            },
        ],
        correctAnswerIndex: {
            type: Number,
        },
        // Coding specific fields
        testCases: [
            {
                input: String,
                expectedOutput: String,
            }
        ],
        initialCode: {
            type: String,
        },
        points: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
