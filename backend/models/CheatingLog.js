const mongoose = require("mongoose");

const cheatingLogSchema = new mongoose.Schema(
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
        incidentType: {
            type: String,
            enum: ["tab_switch", "camera_issue", "multiple_faces", "audio_detected", "other"],
            required: true,
        },
        description: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        screenshotUrl: {
            type: String, // Optional URL to evidence
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CheatingLog", cheatingLogSchema);
