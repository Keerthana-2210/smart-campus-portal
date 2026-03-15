import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        location: '',
        stipend: '',
        eligibility: '',
        deadline: '',
        jobDescriptionFile: null
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, jobDescriptionFile: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, jobDescriptionFile: null });
        }
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
                    location: '',
                    stipend: '',
                    eligibility: '',
                    deadline: '',
                    jobDescriptionFile: null
                });
                // Reset file input via ID
                const fileInput = document.getElementById('jd-file-input');
                if(fileInput) fileInput.value = '';
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
                    <div className="form-group">
                        <label>Job Description File (PDF)</label>
                        <input id="jd-file-input" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        <small style={{color: '#666', display: 'block', marginTop: '0.25rem'}}>Attach a detailed job description document (optional)</small>
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
                                    <th style={{ padding: '0.75rem' }}>Resume</th>
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
                                        <td style={{ padding: '0.75rem' }}>
                                            {app.resumeUrl ? (
                                                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'underline' }}>
                                                    View File
                                                </a>
                                            ) : (
                                                <span style={{ color: '#999' }}>No File</span>
                                            )}
                                        </td>
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
