import React, { useState, useEffect } from "react";
import axios from "axios";
import InternshipCard from "../components/InternshipCard";

const Dashboard = () => {
    const [internships, setInternships] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", company: "" });
    const [message, setMessage] = useState("");

    // Fetch internships
    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/internships");
            setInternships(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Handle form input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit new internship
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/internships", form);
            setMessage("Internship added successfully!");
            setForm({ title: "", description: "", company: "" }); // reset form
            fetchInternships(); // refresh list
        } catch (err) {
            setMessage(err.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Dashboard</h2>

            <h3>Add Internship</h3>
            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                /><br /><br />
                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                /><br /><br />
                <input
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                    required
                /><br /><br />
                <button type="submit">Add Internship</button>
            </form>
            <p>{message}</p>

            <hr />

            <h3>Available Internships</h3>
            {internships.length === 0 ? (
                <p>No internships available</p>
            ) : (
                internships.map((internship) => (
                    <InternshipCard key={internship._id} internship={internship} />
                ))
            )}
        </div>
    );
};

export default Dashboard;
