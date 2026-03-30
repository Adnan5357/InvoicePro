import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  const handleGetStarted = () => {
    // Placeholder - UI only
    console.log('Get Started clicked');
  };

  const handleWatchDemo = () => {
    // Placeholder - UI only
    console.log('Watch Demo clicked');
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6">
            <h1 className="hero-title">
              Create Professional Invoices in Minutes
            </h1>
            <p className="hero-subtitle">
              Streamline your billing process with Invoice Pro. Generate beautiful,
              GST-compliant invoices, manage clients effortlessly, and get paid faster.
              Trusted by thousands of businesses worldwide.
            </p>
            <div className="hero-buttons mt-4">
              <button
                className="btn btn-success btn-lg me-3"
                onClick={handleGetStarted}
              >
                Get Started Free
              </button>
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </button>
            </div>
            <div className="hero-stats mt-5">
              <div className="row">
                <div className="col-4">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="col-4">
                  <div className="stat-number">500K+</div>
                  <div className="stat-label">Invoices Created</div>
                </div>
                <div className="col-4">
                  <div className="stat-number">4.9★</div>
                  <div className="stat-label">User Rating</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="hero-image-container">
              <div className="invoice-preview-card">
                <div className="invoice-header">
                  <div className="invoice-logo">Invoice Pro</div>
                  <div className="invoice-number">INV-2024-001</div>
                </div>
                <div className="invoice-body">
                  <div className="invoice-row">
                    <span className="invoice-label">Bill To:</span>
                    <span className="invoice-value">ABC Corporation</span>
                  </div>
                  <div className="invoice-row">
                    <span className="invoice-label">Date:</span>
                    <span className="invoice-value">Jan 26, 2024</span>
                  </div>
                  <div className="invoice-row">
                    <span className="invoice-label">Amount:</span>
                    <span className="invoice-value amount">₹25,000</span>
                  </div>
                  <div className="invoice-status">
                    <span className="badge bg-success">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;