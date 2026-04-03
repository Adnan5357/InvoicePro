import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import authIllustration from '../assets/auth-illustration.png';
import '../styles/Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const { name, email, password } = formData;
            await register({ name, email, password });
            window.dispatchEvent(new Event('userUpdated'));
            navigate('/dashboard');
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'Failed to sign up. Please try again.'
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
                    <Link to="/" className="auth-logo">
                        <svg className="auth-logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 34L24 14L36 14L24 34H12Z" fill="#6c63ff" />
                            <path d="M18 28L30 8L42 8L30 28H18Z" fill="#6c63ff" opacity="0.6" />
                        </svg>
                    </Link>

                    <div className="auth-header">
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Please fill in your details</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={email}
                                onChange={handleChange}
                                placeholder="Enter your email"
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

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="auth-terms">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedTerms}
                                onChange={(e) => setAgreedTerms(e.target.checked)}
                            />
                            <label htmlFor="terms">
                                I agree to all the <a href="#terms">Terms &amp; Conditions</a>
                            </label>
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Creating Account...' : (
                                <>Sign Up <span className="btn-arrow">→</span></>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?
                        <Link to="/login" className="auth-link">Log In</Link>
                    </div>
                </div>

                {/* Right Side - Purple Decorative */}
                <div className="auth-right">
                    <div className="illustration-card">
                        <img
                            src={authIllustration}
                            alt="Person working on laptop"
                            className="illustration-img"
                        />
                    </div>

                    <div className="auth-right-content">
                        <h2 className="auth-description-title">Seamless work experience</h2>
                        <p className="auth-description-text">
                            Everything you need in an easily customizable dashboard
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signup;
