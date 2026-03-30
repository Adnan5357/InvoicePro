import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    // Listen for login/logout/profile update events
    window.addEventListener('storage', loadUser);
    window.addEventListener('userUpdated', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.nav-user-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setDropdownOpen(false);
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

  const isLoggedIn = !!user && !!sessionStorage.getItem('token');

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to={isLoggedIn ? '/dashboard' : '/'}>
            <span className="text-primary">Invoice</span> Pro
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/invoice-generator">Generator</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/invoice-history">History</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/client-management">Clients</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/tax-calculator">Tax Calc</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/pdf-export">Export</Link>
                  </li>

                  {/* User Avatar Dropdown */}
                  <li className="nav-item ms-3 nav-user-dropdown">
                    <button
                      className="nav-user-btn"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span className="nav-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          getInitials(user.name)
                        )}
                      </span>
                      <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
                      <svg className={`nav-chevron ${dropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="nav-dropdown">
                        <div className="nav-dropdown-header">
                          <span className="nav-dropdown-name">{user.name}</span>
                          <span className="nav-dropdown-email">{user.email}</span>
                        </div>
                        <div className="nav-dropdown-divider"></div>
                        <Link to="/profile" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                          My Profile
                        </Link>
                        <Link to="/dashboard" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                          </svg>
                          Dashboard
                        </Link>
                        <div className="nav-dropdown-divider"></div>
                        <button className="nav-dropdown-item logout" onClick={handleLogout}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/invoice-generator">Generator</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/invoice-history">History</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/client-management">Clients</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/tax-calculator">Tax Calc</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/pdf-export">Export</Link>
                  </li>
                  <li className="nav-item ms-3">
                    <Link className="btn btn-outline-primary" to="/login">Login</Link>
                  </li>
                  <li className="nav-item ms-2">
                    <Link className="btn btn-primary" to="/signup">Sign Up Free</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="navbar-spacer"></div>
    </>
  );
};

export default Navbar;
