const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Generate JWT Token Function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student", // default role is student
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Verify user exists and password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/auth/me
// @desc    Get user profile (Protected Route Example)
// @access  Private
router.get("/me", protect, async (req, res) => {
    try {
        // req.user is populated by the protect middleware
        res.json({
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/auth/notifications/:id
// @desc    Get user notifications (Mocked/Alias for frontend compatibility)
// @access  Private
router.get("/notifications/:id", protect, async (req, res) => {
    try {
        // Return dummy notifications to fulfill the frontend requirement
        res.json([
            { message: "Welcome to the Smart Campus Portal!", type: "info" },
            { message: "Complete your profile to increase internship application chances.", type: "warning" }
        ]);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
