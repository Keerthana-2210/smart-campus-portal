const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const { protect, admin, student } = require("../middleware/authMiddleware");

// @route   POST /api/applications
// @desc    Apply for an internship (Student only)
// @access  Private/Student
router.post("/", protect, student, async (req, res) => {
    try {
        const { internshipId, resumeUrl } = req.body;

        // Check if internship exists
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            student: req.user._id,
            internship: internshipId,
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this internship" });
        }

        const application = await Application.create({
            student: req.user._id,
            internship: internshipId,
            resumeUrl,
            status: "pending",
        });

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/applications/my-applications
// @desc    Track application status (Student only)
// @access  Private/Student
router.get("/my-applications", protect, student, async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate({
                path: "internship",
                populate: { path: "company", select: "name logo" },
            })
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/applications
// @desc    View all applications (Admin only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate("student", "name email")
            .populate({
                path: "internship",
                select: "role companyName",
            })
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Admin only)
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
    try {
        const { status } = req.body; // e.g., 'reviewed', 'accepted', 'rejected'

        // Validate status
        const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
