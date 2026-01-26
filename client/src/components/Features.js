import React from 'react';
import '../styles/Features.css';

const Features = () => {
  const features = [
    {
      icon: 'bi-file-earmark-text',
      title: 'Easy Invoice Generator',
      description: 'Create professional invoices in seconds with our intuitive drag-and-drop interface. No design skills required.'
    },
    {
      icon: 'bi-calculator',
      title: 'GST & Tax Calculation',
      description: 'Automatically calculate GST, taxes, and discounts. Stay compliant with Indian tax regulations effortlessly.'
    },
    {
      icon: 'bi-download',
      title: 'Download & Share PDFs',
      description: 'Export invoices as high-quality PDFs. Share directly via email or download for offline use.'
    },
    {
      icon: 'bi-people',
      title: 'Client Management',
      description: 'Organize all your clients in one place. Quick access to contact details and invoice history.'
    },
    {
      icon: 'bi-graph-up',
      title: 'Invoice History',
      description: 'Track all your invoices with advanced filtering and search. Never lose an invoice again.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure & Reliable',
      description: 'Bank-level encryption ensures your data is safe. Regular backups and 99.9% uptime guarantee.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2 className="section-title">Powerful Features for Your Business</h2>
        <p className="section-subtitle">
          Everything you need to manage invoices efficiently and grow your business
        </p>
        
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card feature-card h-100 p-4">
                <div className="feature-icon mb-3">
                  <i className={feature.icon}></i>
                </div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
