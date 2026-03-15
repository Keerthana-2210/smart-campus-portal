import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MockTest = () => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [availableCompanies, setAvailableCompanies] = useState([]);
    
    const [warnings, setWarnings] = useState(0);
    const [testActive, setTestActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
    const navigate = useNavigate();

    // Fetch companies on mount
    useEffect(() => {
        fetch("https://smart-campus-portal-bub3.onrender.com/api/internships")
            .then(res => res.json())
            .then(data => {
                // Extract unique company names
                const companies = Array.from(new Set(data.map(i => i.companyName || (i.company && i.company.name)).filter(Boolean)));
                if (companies.length > 0) {
                    setAvailableCompanies(companies);
                } else {
                    setAvailableCompanies(['Google', 'Microsoft', 'Amazon']); // Fallback mock data
                }
            })
            .catch(err => {
                console.error("Failed to fetch companies:", err);
                setAvailableCompanies(['Google', 'Microsoft', 'Amazon']); // Fallback mock data
            });
    }, []);

    const handleStartTest = (company) => {
        setSelectedCompany(company);
        setTestActive(true);
        setTimeLeft(60 * 60);
    };

    // Generate 40 questions dynamically
    const questions = Array.from({ length: 40 }, (_, i) => {
        const companyPrefix = selectedCompany ? `${selectedCompany} ` : '';
        if (i < 30) {
            return {
                id: i + 1,
                type: 'MCQ',
                question: `${companyPrefix}Aptitude Question ${i + 1}: What is the output of the following logic?`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                answer: 'Option A'
            };
        } else {
            return {
                id: i + 1,
                type: 'CODING',
                question: `${companyPrefix}Coding Question ${i - 29}: Write a function to reverse a string.`,
                placeholder: 'function reverseString(str) {\n  // your code here\n}'
            };
        }
    });

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        let timer;
        if (testActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && testActive) {
            alert("Time is up! Your test forms will be submitted automatically.");
            submitTest();
        }
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testActive, timeLeft]);

    useEffect(() => {
        // Malpractice Detection Methods
        const handleVisibilityChange = () => {
            if (document.hidden && testActive) {
                recordMalpractice("Tab Switched or Minimized");
            }
        };

        const handleWindowBlur = () => {
            if (testActive) {
                recordMalpractice("Clicked Outside Window");
            }
        };

        const handleFullscreenChange = () => {
             if (!document.fullscreenElement && testActive) {
                 recordMalpractice("Exited Fullscreen");
             }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testActive, warnings]);

    const recordMalpractice = (reason) => {
        const newWarnings = warnings + 1;
        setWarnings(newWarnings);
        alert(`MALPRACTICE DETECTED: ${reason}\nWarning ${newWarnings}/3. Your activity has been recorded.`);

        // API call to record event in MongoDB
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (user) {
                fetch('https://smart-campus-portal-bub3.onrender.com/api/malpractice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user._id || user.id,
                        reason,
                        timestamp: new Date().toISOString()
                    })
                });
            }
        } catch (e) {
            console.error("Could not record malpractice", e);
        }

        if (newWarnings >= 3) {
            alert("Test Terminated due to multiple malpractice attempts. Automatically submitting test.");
            submitTest(newWarnings); // Pass the updated warnings count directly
        }
    };

    const handleAnswer = (val) => {
        setAnswers({ ...answers, [currentQuestion]: val });
    };

    const submitTest = async (finalWarnings = warnings) => {
        setTestActive(false);

        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            const user = userStr ? JSON.parse(userStr) : null;

            if (user && token) {
                // Determine mocktest ID. Assuming user clicked a specific test or we have a generic test ID.
                // For this example since UI doesn't pass one, let's just assume we hit a specific generic endpoint or we get first mocktest
                const testRes = await fetch("https://smart-campus-portal-bub3.onrender.com/api/mocktest", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const tests = await testRes.json();
                
                if (tests && tests.length > 0) {
                    const testId = tests[0]._id; // For demo, just pick the first test

                    const res = await fetch(`https://smart-campus-portal-bub3.onrender.com/api/mocktest/${testId}/submit`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            answers: answers,
                            malpracticeCount: finalWarnings
                        })
                    });

                    if (res.ok) {
                        alert("Test Submitted Successfully!");
                    } else {
                        alert("Failed to submit test properly.");
                    }
                } else {
                    alert("No mock tests available to submit against.");
                }
            } else {
                alert("User not logged in.");
            }
        } catch (e) {
             console.error("Error submitting test", e);
             alert("Error connecting to server to submit test.");
        }

        navigate('/student');
    };

    // Format time (MM:SS)
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!testActive) {
        return (
            <div className="test-container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h2 style={{ color: '#0056b3', marginBottom: '1.5rem' }}>Select a Company to Start the Mock Test</h2>
                {availableCompanies.length === 0 ? (
                    <p>Loading companies...</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
                        {availableCompanies.map(company => (
                            <div 
                                key={company} 
                                className="card" 
                                style={{ 
                                    padding: '2rem', 
                                    cursor: 'pointer', 
                                    border: '1px solid #e2e8f0', 
                                    minWidth: '220px',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }} 
                                onClick={() => handleStartTest(company)}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <h3 style={{ margin: 0, color: '#1e293b' }}>{company}</h3>
                                <p style={{ marginTop: '0.5rem', color: '#3b82f6', fontWeight: 'bold' }}>Start Mock Test</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <div className="test-container">
            <div className="mock-test-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>{selectedCompany} Proctored Mock Test</h2>
                    <p>Total Questions: 30 MCQs + 10 Coding Questions</p>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: '#3b82f6', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px' }}>
                    Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            {warnings > 0 && (
                <div className="malpractice-warning">
                    ⚠️ Malpractice Warning: You have {warnings}/3 warnings! Do not change tabs.
                </div>
            )}

            <div className="dashboard-grid" style={{ gridTemplateColumns: '3fr 1fr' }}>
                {/* Left: Question Area */}
                <div>
                    <div className="question-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span className="badge badge-open">{q.type}</span>
                            <span style={{ fontWeight: 600 }}>Question {currentQuestion + 1} of 40</span>
                        </div>

                        <h3 style={{ marginBottom: '1.5rem' }}>{q.question}</h3>

                        {q.type === 'MCQ' ? (
                            <div className="options-grid">
                                {q.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`option-btn ${answers[currentQuestion] === opt ? 'selected' : ''}`}
                                        onClick={() => handleAnswer(opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <textarea
                                className="form-input"
                                rows="10"
                                style={{ fontFamily: 'monospace', backgroundColor: '#f9fafb' }}
                                value={answers[currentQuestion] || ''}
                                onChange={(e) => handleAnswer(e.target.value)}
                                placeholder={q.placeholder}
                            ></textarea>
                        )}

                        <div className="test-controls">
                            <button
                                className="btn btn-secondary"
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion(curr => curr - 1)}
                            >
                                Previous
                            </button>

                            {currentQuestion < questions.length - 1 ? (
                                <button
                                    className="btn"
                                    onClick={() => setCurrentQuestion(curr => curr + 1)}
                                >
                                    Save & Next
                                </button>
                            ) : (
                                <button
                                    className="btn"
                                    style={{ backgroundColor: '#10b981' }}
                                    onClick={() => submitTest()}
                                >
                                    Submit Test
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Question Palette */}
                <div>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Question Palette</h3>
                        </div>
                        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {questions.map((_, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setCurrentQuestion(idx)}
                                    style={{
                                        padding: '0.5rem',
                                        textAlign: 'center',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: currentQuestion === idx ? '#4f46e5' : answers[idx] ? '#10b981' : 'white',
                                        color: currentQuestion === idx || answers[idx] ? 'white' : 'inherit'
                                    }}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockTest;
