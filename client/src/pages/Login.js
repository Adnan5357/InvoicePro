import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'Failed to login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Left Side - Form */}
                <div className="auth-left">
                    <Link to="/" className="auth-logo">Invoice Pro</Link>
                    <div className="auth-header">
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to manage your invoices</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={email}
                                onChange={handleChange}
                                placeholder="Enter your mail"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    value={password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?
                        <Link to="/signup" className="auth-link">Sign up</Link>
                    </div>
                </div>

                {/* Right Side - Dark Teal Decorative */}
                <div className="auth-right">
                    <div className="decorative-squares">
                        <span className="sq-1"></span>
                        <span className="sq-2"></span>
                        <span className="sq-3"></span>
                        <span className="sq-4"></span>
                        <span className="sq-5"></span>
                        <span className="sq-6"></span>
                        <span className="sq-7"></span>
                        <span className="sq-8"></span>
                    </div>

                    {/* Analytics line chart card */}
                    <div className="analytics-card">
                        <div className="analytics-card-header">
                            <h3>Analytics</h3>
                            <div className="analytics-tabs">
                                <span>Weekly</span>
                                <span className="active">Monthly</span>
                                <span>Yearly</span>
                            </div>
                        </div>
                        <div className="chart-area">
                            <svg viewBox="0 0 280 80" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0f2f3f" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#0f2f3f" stopOpacity="0.01" />
                                    </linearGradient>
                                    <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6bc5ce" stopOpacity="0.12" />
                                        <stop offset="100%" stopColor="#6bc5ce" stopOpacity="0.01" />
                                    </linearGradient>
                                </defs>
                                {/* Area fills */}
                                <path d="M0,60 Q40,50 70,35 T140,30 T210,20 T280,15 L280,80 L0,80 Z" fill="url(#chartGrad1)" />
                                <path d="M0,55 Q40,60 70,45 T140,50 T210,35 T280,40 L280,80 L0,80 Z" fill="url(#chartGrad2)" />
                                {/* Lines */}
                                <path d="M0,60 Q40,50 70,35 T140,30 T210,20 T280,15" fill="none" stroke="#0f2f3f" strokeWidth="2" strokeLinecap="round" />
                                <path d="M0,55 Q40,60 70,45 T140,50 T210,35 T280,40" fill="none" stroke="#6bc5ce" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,3" />
                            </svg>
                        </div>
                        <div className="chart-days">
                            <span>MON</span>
                            <span>TUE</span>
                            <span>WED</span>
                            <span>THU</span>
                        </div>
                    </div>

                    {/* Donut chart card */}
                    <div className="donut-card">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#0f2f3f" strokeWidth="12"
                                strokeDasharray="238.76" strokeDashoffset="138.68"
                                strokeLinecap="round" transform="rotate(-90 50 50)" />
                            <text x="50" y="46" textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="500">Total</text>
                            <text x="50" y="60" textAnchor="middle" fontSize="16" fill="#1a1a2e" fontWeight="800">42%</text>
                        </svg>
                    </div>

                    <div className="auth-right-content">
                        <h2 className="auth-description-title">Streamline Your Business</h2>
                        <p className="auth-description-text">
                            Welcome to Invoice Pro! Create professional invoices, track payments, and manage your clients with ease.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
