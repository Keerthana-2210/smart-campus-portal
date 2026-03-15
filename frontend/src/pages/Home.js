import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-hero">
                <div className="hero-content">
                    <span className="badge">🚀 Launch Your Career Today</span>
                    <h1>Smart Campus <span className="highlight">Internship Portal</span></h1>
                    <p className="hero-subtitle">
                        Bridge the gap between academic learning and industry experience. 
                        Connect with top companies, apply for premium internships, and take proctored mock tests to secure your future.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary btn-large">Get Started <span className="arrow">→</span></Link>
                        <Link to="/login" className="btn btn-secondary btn-large">Sign In</Link>
                    </div>
                    
                    <div className="stats-row">
                        <div className="stat-item">
                            <h3>50+</h3>
                            <p>Partner Companies</p>
                        </div>
                        <div className="stat-item">
                            <h3>1000+</h3>
                            <p>Active Internships</p>
                        </div>
                        <div className="stat-item">
                            <h3>98%</h3>
                            <p>Placement Rate</p>
                        </div>
                    </div>
                </div>
                
                <div className="hero-image-container">
                    <div className="blob"></div>
                    <div className="glass-card mockup">
                        <div className="mockup-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <div className="mockup-body">
                            <div className="skeleton-line full"></div>
                            <div className="skeleton-line half"></div>
                            <div className="skeleton-box"></div>
                            <div className="skeleton-line full delay-1"></div>
                            <div className="skeleton-line quarter delay-2"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="features-section">
                <div className="feature-card">
                    <div className="feature-icon">💼</div>
                    <h3>Top Internships</h3>
                    <p>Apply to exclusive opportunities from leading tech companies directly through our portal.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⏱️</div>
                    <h3>Proctored Mock Tests</h3>
                    <p>Prepare for interviews with our company-specific, time-bound aptitude and coding assessments.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📈</div>
                    <h3>Track Progress</h3>
                    <p>Seamlessly upload resumes, track application statuses, and receive instant selection notifications.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
