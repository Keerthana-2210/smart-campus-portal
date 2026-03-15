import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        description: '',
        location: '',
        stipend: '',
        eligibility: '',
        deadline: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://smart-campus-portal-bub3.onrender.com/api/applications", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (err) {
            console.error("Failed to fetch applications", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateInternship = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://smart-campus-portal-bub3.onrender.com/api/internships", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Internship added successfully");
                setFormData({
                    companyName: '',
                    role: '',
                    description: '',
                    location: '',
                    stipend: '',
                    eligibility: '',
                    deadline: ''
                });
            } else {
                const errorData = await response.json();
                alert(`Failed: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Error creating internship", err);
            alert("Error connecting to backend");
        }
    };

    const handleSelectStudent = async (appId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://smart-campus-portal-bub3.onrender.com/api/internships/select/${appId}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Student Selected!");
                fetchApplications();
            } else {
                alert("Failed to select student");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRejectStudent = async (appId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://smart-campus-portal-bub3.onrender.com/api/applications/${appId}/status`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ status: "rejected" })
            });
            if (res.ok) {
                alert("Student Rejected");
                fetchApplications();
            } else {
                alert("Failed to reject student");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: '#0056b3' }}>Admin Dashboard</h2>

            <div className="card">
                <h3>Welcome, {user?.name || 'Admin'}!</h3>
                <p style={{ marginTop: '1rem', color: '#666' }}>
                    Manage job postings and student applications from this dashboard.
                </p>
            </div>

            <div className="card">
                <h3>Add New Internship Opportunity</h3>
                <form onSubmit={handleCreateInternship} style={{ marginTop: '1.5rem' }}>
                    <div className="form-group">
                        <label>Company Name</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Job Role</label>
                        <input type="text" name="role" value={formData.role} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Stipend</label>
                        <input type="text" name="stipend" value={formData.stipend} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Eligibility</label>
                        <input type="text" name="eligibility" value={formData.eligibility} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Application Deadline</label>
                        <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Post Internship</button>
                </form>
            </div>

            {/* --- Applications --- */}
            <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Student Applications</h3>
                {applications.length === 0 ? (
                    <p style={{ color: '#666' }}>No applications yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                                    <th style={{ padding: '0.75rem' }}>Email</th>
                                    <th style={{ padding: '0.75rem' }}>Company</th>
                                    <th style={{ padding: '0.75rem' }}>Role</th>
                                    <th style={{ padding: '0.75rem' }}>Status</th>
                                    <th style={{ padding: '0.75rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '0.75rem' }}>{app.student?.name}</td>
                                        <td style={{ padding: '0.75rem' }}>{app.student?.email}</td>
                                        <td style={{ padding: '0.75rem' }}>{app.internship?.companyName || app.internship?.company?.name || 'Company'}</td>
                                        <td style={{ padding: '0.75rem' }}>{app.internship?.role || app.internship?.title || 'Role'}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem',
                                                backgroundColor: app.status.toLowerCase() === 'accepted' ? '#d1fae5' : 
                                                                 app.status.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                                                color: app.status.toLowerCase() === 'accepted' ? '#065f46' : 
                                                       app.status.toLowerCase() === 'rejected' ? '#991b1b' : '#92400e'
                                            }}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                className="btn" 
                                                style={{ backgroundColor: '#10b981', padding: '0.5rem' }}
                                                onClick={() => handleSelectStudent(app._id)}
                                                disabled={app.status.toLowerCase() === 'accepted'}
                                            >
                                                Select
                                            </button>
                                            <button 
                                                className="btn" 
                                                style={{ backgroundColor: '#ef4444', padding: '0.5rem' }}
                                                onClick={() => handleRejectStudent(app._id)}
                                                disabled={app.status.toLowerCase() === 'rejected'}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
