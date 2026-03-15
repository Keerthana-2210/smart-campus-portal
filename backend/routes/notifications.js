const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect, student } = require("../middleware/authMiddleware");

// @route   GET /api/notifications/:studentId
// @desc    Get notifications for a student
// @access  Private/Student
router.get("/:studentId", protect, student, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.studentId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const notifications = await Notification.find({ recipient: req.params.studentId })
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
