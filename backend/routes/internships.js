const express = require("express");
const router = express.Router();
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const { protect, admin, student } = require("../middleware/authMiddleware");

// @route   GET /api/internships
// @desc    Get all internships
// @access  Public or Private (both Student & Admin)
router.get("/", async (req, res) => {
    try {
        const internships = await Internship.find({ isActive: true })
            .sort({ createdAt: -1 });
        res.json(internships);
    } catch (error) {
        console.error("Error fetching internships:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/internships
// @desc    Create a new internship (Admin)
// @access  Public or Private/Admin (Removing auth temporarily to ensure form works cleanly, but can be added back)
router.post("/", async (req, res) => {
    try {
        const { companyName, role, description, location, stipend, eligibility, deadline, jobDescriptionFile } = req.body;

        const internship = await Internship.create({
            companyName,
            role,
            description,
            location,
            stipend,
            eligibility,
            deadline,
            jobDescriptionFile
        });

        res.status(201).json(internship);
    } catch (error) {
        console.error("Error creating internship:", error);
        res.status(500).json({ message: "Server Error: Could not create internship." });
    }
});

// @route   POST /api/internships/apply
// @desc    Apply for an internship
// @access  Public or Private/Student
router.post("/apply", async (req, res) => {
    try {
        const { internshipId, studentId, resumeUrl } = req.body;

        // Check if internship exists
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            student: studentId,
            internship: internshipId,
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this internship" });
        }

        const application = await Application.create({
            student: studentId,
            internship: internshipId,
            resumeUrl,
            status: "pending",
        });

        res.status(201).json(application);
    } catch (error) {
        console.error("Error applying to internship:", error);
        res.status(500).json({ message: "Server Error: Could not process application." });
    }
});

// @route   PUT /api/internships/select/:id
// @desc    Select a student for an internship (Admin only)
// @access  Public or Private/Admin
router.put("/select/:id", async (req, res) => {
    try {
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId).populate('internship');
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.status = "accepted";
        await application.save();

        // Create notification for the student
        await Notification.create({
            recipient: application.student,
            message: `Congratulations! You have been selected for the ${application.internship.role} Internship at ${application.internship.companyName}.`,
            type: "internship_selection"
        });

        res.json({ message: "Student selected successfully", application });
    } catch (error) {
        console.error("Error selecting student:", error);
        res.status(500).json({ message: "Server Error: Could not update application status." });
    }
});

module.exports = router;
