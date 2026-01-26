import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const handleLogin = () => {
    // Placeholder - UI only
    console.log('Login clicked');
  };

  const handleSignUp = () => {
    // Placeholder - UI only
    console.log('Sign Up clicked');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <a className="navbar-brand fw-bold fs-4" href="#home">
          <span className="text-primary">Invoice</span> Pro
        </a>
        
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
            <li className="nav-item">
              <a className="nav-link" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#pricing">Pricing</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item ms-3">
              <button 
                className="btn btn-outline-primary"
                onClick={handleLogin}
              >
                Login
              </button>
            </li>
            <li className="nav-item ms-2">
              <button 
                className="btn btn-primary"
                onClick={handleSignUp}
              >
                Sign Up Free
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
