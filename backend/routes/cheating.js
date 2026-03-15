const express = require("express");
const router = express.Router();
const CheatingLog = require("../models/CheatingLog");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   POST /api/cheating
// @desc    Log a new cheating incident (from Student Client or Python Service)
// @access  Private
router.post("/", protect, async (req, res) => {
    try {
        const { mockTestId, incidentType, description, severity, screenshotUrl } = req.body;

        const cheatingLog = await CheatingLog.create({
            student: req.user._id,
            mockTest: mockTestId,
            incidentType,
            description,
            severity: severity || "medium",
            screenshotUrl,
        });

        res.status(201).json(cheatingLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/cheating/:mockTestId
// @desc    Get cheating logs for a specific Mock Test (Admin only)
// @access  Private/Admin
router.get("/:mockTestId", protect, admin, async (req, res) => {
    try {
        const logs = await CheatingLog.find({ mockTest: req.params.mockTestId })
            .populate("student", "name email")
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/cheating/student/:studentId
// @desc    Get all cheating logs for a specific student (Admin only)
// @access  Private/Admin
router.get("/student/:studentId", protect, admin, async (req, res) => {
    try {
        const logs = await CheatingLog.find({ student: req.params.studentId })
            .populate("mockTest", "title")
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
