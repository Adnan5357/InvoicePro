import React from 'react';
import '../styles/WhyChoose.css';

const WhyChoose = () => {
  const benefits = [
    'Save hours every week with automated invoice generation',
    'Professional invoices that build trust with your clients',
    'GST-compliant templates for Indian businesses',
    'Real-time payment tracking and reminders',
    'Access from anywhere with cloud-based storage',
    'Affordable pricing with no hidden fees',
    '24/7 customer support when you need help',
    'Regular updates with new features and improvements'
  ];

  return (
    <section id="about" className="why-choose-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2 className="section-title text-start">Why Choose Invoice Pro?</h2>
            <p className="mb-4 text-muted">
              Join thousands of businesses that trust Invoice Pro for their billing needs. 
              We combine powerful features with simplicity to help you focus on what matters most - growing your business.
            </p>
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <i className="bi bi-check-circle-fill benefit-icon"></i>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="why-choose-image">
              <div className="stats-card p-4">
                <h3 className="mb-4">Trusted by Industry Leaders</h3>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-box">
                      <div className="stat-value">99.9%</div>
                      <div className="stat-text">Uptime</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-box">
                      <div className="stat-value">24/7</div>
                      <div className="stat-text">Support</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-box">
                      <div className="stat-value">50K+</div>
                      <div className="stat-text">Invoices/Month</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-box">
                      <div className="stat-value">4.9/5</div>
                      <div className="stat-text">Rating</div>
                    </div>
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

export default WhyChoose;
