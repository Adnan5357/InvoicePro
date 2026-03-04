import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to="/">
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
              <li className="nav-item">
                <Link className="nav-link" to="/security">Security</Link>
              </li>
              <li className="nav-item ms-3">
                <Link
                  className="btn btn-outline-primary"
                  to="/login"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item ms-2">
                <Link
                  className="btn btn-primary"
                  to="/signup"
                >
                  Sign Up Free
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="navbar-spacer"></div>
    </>
  );
};

export default Navbar;
