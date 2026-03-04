import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Security = () => {
    const [twoFactor, setTwoFactor] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h2 className="mb-4">Security & Settings</h2>

                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white">
                                <h5 className="mb-0"><i className="bi bi-shield-lock me-2"></i>Account Security</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Change Password</label>
                                    <input type="password" class="form-control mb-2" placeholder="Current Password" />
                                    <input type="password" class="form-control mb-2" placeholder="New Password" />
                                    <input type="password" class="form-control" placeholder="Confirm New Password" />
                                    <button className="btn btn-primary mt-2">Update Password</button>
                                </div>
                                <hr />
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="2fa"
                                        checked={twoFactor}
                                        onChange={() => setTwoFactor(!twoFactor)}
                                    />
                                    <label className="form-check-label" htmlFor="2fa">
                                        Enable Two-Factor Authentication (2FA)
                                    </label>
                                    <div className="form-text">Add an extra layer of security to your account.</div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white">
                                <h5 className="mb-0"><i className="bi bi-bell me-2"></i>Notifications</h5>
                            </div>
                            <div className="card-body">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="emailNotifs"
                                        checked={emailNotifs}
                                        onChange={() => setEmailNotifs(!emailNotifs)}
                                    />
                                    <label className="form-check-label" htmlFor="emailNotifs">
                                        Email Login Alerts
                                    </label>
                                    <div className="form-text">Get notified when your account is accessed from a new device.</div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-danger">
                            <div className="card-header bg-danger text-white">
                                <h5 className="mb-0"><i className="bi bi-exclamation-triangle me-2"></i>Danger Zone</h5>
                            </div>
                            <div className="card-body">
                                <p>Once you delete your account, there is no going back. Please be certain.</p>
                                <button className="btn btn-outline-danger">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Security;
