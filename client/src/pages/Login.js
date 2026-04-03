import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import authIllustration from '../assets/auth-illustration.png';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
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
            window.dispatchEvent(new Event('userUpdated'));
            navigate('/dashboard');
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
                    <Link to="/" className="auth-logo">
                        <svg className="auth-logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 34L24 14L36 14L24 34H12Z" fill="#6c63ff" />
                            <path d="M18 28L30 8L42 8L30 28H18Z" fill="#6c63ff" opacity="0.6" />
                        </svg>
                    </Link>

                    <div className="auth-header">
                        <h2 className="auth-title">Welcome Back !</h2>
                        <p className="auth-subtitle">Please enter your details</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
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

                        <div className="auth-options-row">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Signing in...' : (
                                <>Login <span className="btn-arrow">→</span></>
                            )}
                        </button>
                    </form>

                    <div className="auth-terms-footer">
                        By creating an account, you agree to our{' '}
                        <a href="#terms">Terms of Service</a> and{' '}
                        <a href="#privacy">Privacy Policy</a>
                    </div>

                    <div className="auth-footer">
                        Don't have an account?
                        <Link to="/signup" className="auth-link">Sign Up</Link>
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

export default Login;
