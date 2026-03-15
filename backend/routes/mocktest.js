const express = require("express");
const router = express.Router();
const MockTest = require("../models/MockTest");
const Question = require("../models/Question");
const Result = require("../models/Result");
const { protect, admin, student } = require("../middleware/authMiddleware");

// @route   POST /api/mocktest
// @desc    Create a new mock test (Admin only)
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const { title, description, durationMinutes, passingScore } = req.body;

        const mockTest = await MockTest.create({
            title,
            description,
            durationMinutes,
            passingScore,
        });

        res.status(201).json(mockTest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/mocktest/:id/questions
// @desc    Add a question (MCQ or Coding) to a mock test (Admin)
// @access  Private/Admin
router.post("/:id/questions", protect, admin, async (req, res) => {
    try {
        const mockTest = await MockTest.findById(req.params.id);
        if (!mockTest) {
            return res.status(404).json({ message: "Mock test not found" });
        }

        const { type, text, options, correctAnswerIndex, testCases, initialCode, points } = req.body;

        const question = await Question.create({
            mockTest: mockTest._id,
            type: type || "mcq",
            text,
            options,
            correctAnswerIndex,
            testCases,
            initialCode,
            points,
        });

        // Add question reference to MockTest
        mockTest.questions.push(question._id);
        await mockTest.save();

        res.status(201).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/mocktest
// @desc    Get all available mock tests
// @access  Private
router.get("/", protect, async (req, res) => {
    try {
        const tests = await MockTest.find({ isActive: true }).select("-questions");
        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/mocktest/:id/attempt
// @desc    Start/Attempt a mock test (Student) - Fetches questions securely
// @access  Private/Student
router.get("/:id/attempt", protect, student, async (req, res) => {
    try {
        const mockTest = await MockTest.findById(req.params.id).populate({
            path: "questions",
            // Exclude correct answers and test cases from being sent to the frontend!
            select: "-correctAnswerIndex -testCases",
        });

        if (!mockTest) {
            return res.status(404).json({ message: "Mock test not found" });
        }

        res.json(mockTest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/mocktest/:id/submit
// @desc    Submit a mock test & auto-calculate score (Student)
// @access  Private/Student
router.post("/:id/submit", protect, student, async (req, res) => {
    try {
        const { answers, malpracticeCount } = req.body; // e.g. { "questionId1": selectedIndex, "questionCode2": "code string" }

        const mockTest = await MockTest.findById(req.params.id).populate("questions");
        if (!mockTest) {
            return res.status(404).json({ message: "Mock test not found" });
        }

        let score = 0;
        let totalPoints = 0;

        // Very basic auto-grading logic
        mockTest.questions.forEach((q) => {
            totalPoints += q.points;

            const studentAnswer = answers[q._id.toString()];

            if (q.type === "mcq") {
                if (studentAnswer === q.correctAnswerIndex) {
                    score += q.points;
                }
            } else if (q.type === "coding") {
                // Pseudo-grading for coding: in a real app, this would execute code against testCases securely using Docker or a service like Judge0
                // For now, give full points if they wrote something not empty
                if (studentAnswer && studentAnswer.trim().length > 0) {
                    score += q.points;
                }
            }
        });

        const passed = (score / totalPoints) * 100 >= mockTest.passingScore;

        // Save Result
        const result = await Result.create({
            student: req.user._id,
            mockTest: mockTest._id,
            score,
            totalPoints,
            passed,
            malpracticeCount: malpracticeCount || 0,
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/mocktest/results/my-results
// @desc    Get student's past results (Student)
// @access  Private/Student
router.get("/results/my-results", protect, student, async (req, res) => {
    try {
        const results = await Result.find({ student: req.user._id })
            .populate("mockTest", "title passingScore")
            .sort({ completedAt: -1 });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;