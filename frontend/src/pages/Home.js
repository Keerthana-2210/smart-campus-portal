import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-hero">
            <h1>Smart Campus Internship Portal</h1>
            <p>
                Welcome to the Smart Campus Internship Portal.
                Connect with top companies, apply for internships, and launch your career.
            </p>
            <div className="hero-buttons">
                <Link to="/login" className="btn btn-login">Login</Link>
                <Link to="/register" className="btn btn-register">Register</Link>
            </div>
        </div>
    );
};

export default Home;
