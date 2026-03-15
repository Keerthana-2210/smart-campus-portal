const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   POST /api/companies
// @desc    Add a new company (Admin only)
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, website, description, logo, location } = req.body;
        const company = await Company.create({
            name,
            website,
            description,
            logo,
            location,
        });
        res.status(201).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   PUT /api/companies/:id
// @desc    Edit a company (Admin only)
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const { name, website, description, logo, location } = req.body;
        company.name = name || company.name;
        company.website = website || company.website;
        company.description = description || company.description;
        company.logo = logo || company.logo;
        company.location = location || company.location;

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   DELETE /api/companies/:id
// @desc    Delete a company (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        await company.deleteOne();
        res.json({ message: "Company removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   GET /api/companies
// @desc    Get all companies (Student & Admin)
// @access  Private
router.get("/", protect, async (req, res) => {
    try {
        const companies = await Company.find({}).sort({ createdAt: -1 });
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
