const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const internshipRoutes = require("./routes/internships");
const mockTestRoutes = require("./routes/mocktest");
const companyRoutes = require("./routes/companies");
const applicationRoutes = require("./routes/applications");
const cheatingRoutes = require("./routes/cheating");
const notificationRoutes = require("./routes/notifications");

// Load ENV vars
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "15mb" })); // Increased limit to support Base64 PDFs
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/mocktest", mockTestRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/cheating", cheatingRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.json({ message: "API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
