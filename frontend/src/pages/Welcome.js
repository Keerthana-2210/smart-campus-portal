import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="hero-section">
                <div className="hero-badge">✨ Next-Generation Campus Portal</div>

                <h1 className="hero-title">
                    Empowering Your <br />
                    <span className="gradient-text">Academic Career</span>
                </h1>

                <p className="hero-subtitle">
                    Connect with top companies, manage internships efficiently, and access
                    proctored mock tests all in one sleek, unified platform.
                </p>

                <div className="hero-buttons">
                    <button
                        className="btn btn-primary hero-btn"
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </button>
                    <button
                        className="btn btn-outline hero-btn"
                        onClick={() => navigate("/login")}
                    >
                        Log In Existing
                    </button>
                </div>
            </div>

            <div className="features-grid">
                <div className="glass-card feature-card">
                    <div className="feature-icon">🚀</div>
                    <h3>Internship Hub</h3>
                    <p>Discover and apply for top tech internships instantly.</p>
                </div>
                <div className="glass-card feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>Proctored Mock Tests</h3>
                    <p>AI-powered anti-cheat systems to ensure fair testing environments.</p>
                </div>
                <div className="glass-card feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Realtime Analytics</h3>
                    <p>Track your test results and internship application lifecycles.</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
