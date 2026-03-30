import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Features.css';

const Features = () => {
  const features = [
    {
      icon: 'bi-file-earmark-text',
      title: 'Easy Invoice Generator',
      description: 'Create professional invoices in seconds with our intuitive drag-and-drop interface. No design skills required.',
      link: '/invoice-generator'
    },
    {
      icon: 'bi-calculator',
      title: 'GST & Tax Calculation',
      description: 'Automatically calculate GST, taxes, and discounts. Stay compliant with Indian tax regulations effortlessly.',
      link: '/tax-calculator'
    },
    {
      icon: 'bi-download',
      title: 'Download & Share PDFs',
      description: 'Export invoices as high-quality PDFs. Share directly via email or download for offline use.',
      link: '/pdf-export'
    },
    {
      icon: 'bi-people',
      title: 'Client Management',
      description: 'Organize all your clients in one place. Quick access to contact details and invoice history.',
      link: '/client-management'
    },
    {
      icon: 'bi-graph-up',
      title: 'Invoice History',
      description: 'Track all your invoices with advanced filtering and search. Never lose an invoice again.',
      link: '/invoice-history'
    },
    {
      icon: 'bi-speedometer2',
      title: 'Dashboard Analytics',
      description: 'Get real-time insights into your revenue, pending payments, and top clients with beautiful visual charts.',
      link: '/dashboard'
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
                <Link to={feature.link} className="stretched-link"></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
