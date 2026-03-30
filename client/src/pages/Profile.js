import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api, { logout } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        avatar: '',
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/user/profile');
            setProfile(response.data);
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                company: response.data.company || '',
                address: response.data.address || '',
                avatar: response.data.avatar || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            const reader = new FileReader();
            reader.onloadend = () => {
                img.src = reader.result;
            };
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 200;
                canvas.width = MAX_SIZE;
                canvas.height = MAX_SIZE;
                const ctx = canvas.getContext('2d');
                // Crop to square from center
                const minDim = Math.min(img.width, img.height);
                const sx = (img.width - minDim) / 2;
                const sy = (img.height - minDim) / 2;
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                setFormData({ ...formData, avatar: compressedBase64 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const updateData = { ...formData };

            if (showPasswordSection && passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setMessage({ text: 'Passwords do not match', type: 'error' });
                    setSaving(false);
                    return;
                }
                if (passwordData.newPassword.length < 6) {
                    setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
                    setSaving(false);
                    return;
                }
                updateData.password = passwordData.newPassword;
            }

            const response = await api.put('/user/profile', updateData);
            setProfile(response.data);

            // Update sessionStorage user data
            const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
            const updatedUser = { ...storedUser, name: response.data.name, email: response.data.email, avatar: response.data.avatar };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setEditing(false);
            setShowPasswordSection(false);
            setPasswordData({ newPassword: '', confirmPassword: '' });

            // Dispatch event so Navbar updates
            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            console.error('Profile update error:', error.response?.data || error.message);
            setMessage({
                text: error.response?.data?.message || error.message || 'Failed to update profile',
                type: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            company: profile.company || '',
            address: profile.address || '',
            avatar: profile.avatar || '',
        });
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
        setEditing(false);
        setMessage({ text: '', type: '' });
    };

    const handleLogout = () => {
        logout();
        window.dispatchEvent(new Event('userUpdated'));
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="profile-loading">
                    <div className="profile-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-page">
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-header-bg"></div>
                        <div className="profile-header-content">
                            <div className="profile-avatar-container">
                                {formData.avatar || profile?.avatar ? (
                                    <img 
                                        src={editing && formData.avatar ? formData.avatar : (profile?.avatar || formData.avatar)} 
                                        alt="Avatar" 
                                        className="profile-avatar-large" 
                                        style={{ objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <div className="profile-avatar-large">
                                        {getInitials(profile?.name)}
                                    </div>
                                )}
                                {editing && (
                                    <label className="avatar-upload-btn" title="Upload Profile Picture">
                                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </label>
                                )}
                            </div>
                            <div className="profile-header-info">
                                <h1 className="profile-name">{profile?.name}</h1>
                                <p className="profile-email">{profile?.email}</p>
                                {profile?.company && (
                                    <span className="profile-company-badge">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 21h18" /><path d="M9 8h1" /><path d="M9 12h1" /><path d="M9 16h1" /><path d="M14 8h1" /><path d="M14 12h1" /><path d="M14 16h1" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                                        </svg>
                                        {profile.company}
                                    </span>
                                )}
                            </div>
                            {!editing && (
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <button className="profile-edit-btn" onClick={() => setEditing(true)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                    <button 
                                        className="profile-logout-btn" 
                                        onClick={handleLogout}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.6rem 1.25rem',
                                            border: 'none',
                                            borderRadius: '10px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#ef4444';
                                            e.currentTarget.style.color = '#fff';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.35)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                            e.currentTarget.style.color = '#ef4444';
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    {message.text && (
                        <div className={`profile-message ${message.type}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {message.type === 'success' ? (
                                    <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                                ) : (
                                    <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
                                )}
                            </svg>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Details */}
                    <div className="profile-sections">
                        <div className="profile-section">
                            <div className="section-header">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                                <h3>Personal Information</h3>
                            </div>

                            <div className="profile-fields">
                                <div className="profile-field">
                                    <label>Full Name</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                        />
                                    ) : (
                                        <p>{profile?.name || '—'}</p>
                                    )}
                                </div>

                                <div className="profile-field">
                                    <label>Email Address</label>
                                    {editing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <p>{profile?.email || '—'}</p>
                                    )}
                                </div>

                                <div className="profile-field">
                                    <label>Phone Number</label>
                                    {editing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <p>{profile?.phone || '—'}</p>
                                    )}
                                </div>

                                <div className="profile-field">
                                    <label>Company</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            placeholder="Enter your company name"
                                        />
                                    ) : (
                                        <p>{profile?.company || '—'}</p>
                                    )}
                                </div>

                                <div className="profile-field full-width">
                                    <label>Address</label>
                                    {editing ? (
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter your address"
                                            rows="3"
                                        />
                                    ) : (
                                        <p>{profile?.address || '—'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Change Password Section */}
                        {editing && (
                            <div className="profile-section">
                                <div className="section-header">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <h3>Change Password</h3>
                                    <button
                                        className="toggle-password-btn"
                                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                                    >
                                        {showPasswordSection ? 'Cancel' : 'Change'}
                                    </button>
                                </div>

                                {showPasswordSection && (
                                    <div className="profile-fields">
                                        <div className="profile-field">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div className="profile-field">
                                            <label>Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Account Info */}
                        <div className="profile-section">
                            <div className="section-header">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                                <h3>Account Info</h3>
                            </div>
                            <div className="profile-fields">
                                <div className="profile-field">
                                    <label>Member Since</label>
                                    <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Last Updated</label>
                                    <p>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {editing && (
                        <div className="profile-actions">
                            <button className="profile-cancel-btn" onClick={handleCancel} disabled={saving}>
                                Cancel
                            </button>
                            <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
