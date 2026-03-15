import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Data structure can be either direct user object or {token, user: {}}
                const userData = data.user || data;
                localStorage.setItem('user', JSON.stringify(userData));
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Redirect based on role
                if (userData.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/student');
                }
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="form-container">
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to Your Account</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
