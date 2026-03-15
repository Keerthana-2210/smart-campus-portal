import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [internships, setInternships] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null); // Modal state
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);
            fetchNotifications(parsedUser._id || parsedUser.id);
        }
        fetchInternships();
    }, []);

    const fetchNotifications = async (studentId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://smart-campus-portal-bub3.onrender.com/api/notifications/${studentId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    const fetchInternships = async () => {
        try {
            const response = await fetch("https://smart-campus-portal-bub3.onrender.com/api/internships");
            if (response.ok) {
                const data = await response.json();
                setInternships(data);
            }
        } catch (err) {
            console.error("Fetch internships error", err);
        }
    };

    const handleApply = async (internshipId) => {
        if (!user) return alert("Please log in to apply");

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("https://smart-campus-portal-bub3.onrender.com/api/internships/apply", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    internshipId,
                    studentId: user._id || user.id
                })
            });

            if (response.status === 201) {
                alert("Successfully applied for internship!");
                setSelectedInternship(null); // Close modal
            } else {
                const errData = await response.json();
                alert(errData.message || "Could not apply.");
            }
        } catch (err) {
            console.error("Apply error", err);
            alert("Error connecting to server.");
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: '#0056b3' }}>Student Dashboard</h2>

            <div className="card">
                <h3>Welcome, {user?.name || 'Student'}!</h3>
                <p style={{ marginTop: '1rem', color: '#666' }}>
                    This is your central hub for finding internships, tracking applications, and taking mock tests.
                </p>
            </div>

            {/* --- Notifications Panel --- */}
            {notifications.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#166534' }}>Announcements & Notifications</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {notifications.map(notif => (
                            <li key={notif._id} style={{ 
                                padding: '1rem', 
                                borderBottom: '1px solid #dcfce7',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                color: '#15803d'
                            }}>
                                <span>🔔</span>
                                <span>{notif.message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* --- Mock Test Section --- */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Mock Test</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                    Prepare for your upcoming internship interviews by taking our proctored mock test. 
                    The test includes 30 MCQs and 10 coding questions to be completed in 60 minutes.
                </p>
                <button 
                    className="btn-primary" 
                    style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}
                    onClick={() => navigate('/mock-test')}
                >
                    Start Mock Test
                </button>
            </div>

            {/* --- Available Internships --- */}
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Available Internships</h3>

                {internships.length === 0 ? (
                    <p style={{ color: '#666' }}>No internships available currently.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {internships.map(internship => (
                            <div key={internship._id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>{internship.companyName}</h4>
                                <p style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>{internship.role}</p>

                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                                    <span>📍 {internship.location}</span>
                                    <span>💵 {internship.stipend}</span>
                                </div>

                                <button
                                    className="btn-primary"
                                    style={{ padding: '0.5rem', fontSize: '0.875rem', backgroundColor: '#3b82f6' }}
                                    onClick={() => setSelectedInternship(internship)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Modal / View Details --- */}
            {selectedInternship && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ color: '#0f172a' }}>{selectedInternship.role} at {selectedInternship.companyName}</h2>
                            <button
                                onClick={() => setSelectedInternship(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
                            >×</button>
                        </div>

                        <div style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#334155' }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Full Job Description</h4>
                            <p style={{ marginBottom: '1rem', whiteSpace: 'pre-line' }}>{selectedInternship.description}</p>

                            <h4 style={{ marginBottom: '0.5rem' }}>Eligibility</h4>
                            <p style={{ marginBottom: '1rem' }}>{selectedInternship.eligibility}</p>

                            <h4 style={{ marginBottom: '0.5rem' }}>Details</h4>
                            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li><strong>Location:</strong> {selectedInternship.location}</li>
                                <li><strong>Stipend:</strong> {selectedInternship.stipend}</li>
                                <li><strong>Deadline:</strong> {new Date(selectedInternship.deadline).toLocaleDateString()}</li>
                            </ul>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={() => handleApply(selectedInternship._id)}
                            style={{ padding: '1rem', fontWeight: 'bold' }}
                        >
                            Apply for Internship
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentDashboard;
