import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Sign Up Free',
      description: 'Create your account in less than 30 seconds. No credit card required. Start with our free plan.'
    },
    {
      number: '2',
      title: 'Create Invoice',
      description: 'Fill in your client details, add items, and customize your invoice. Our smart templates make it easy.'
    },
    {
      number: '3',
      title: 'Download & Send',
      description: 'Download as PDF or send directly via email. Track payment status and manage everything in one place.'
    }
  ];

  return (
    <section className="how-it-works-section bg-light">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Get started with Invoice Pro in three simple steps
        </p>
        
        <div className="row g-4">
          {steps.map((step, index) => (
            <div key={index} className="col-md-4">
              <div className="card step-card h-100 p-4 text-center">
                <div className="step-number mb-3">{step.number}</div>
                <h4 className="step-title mb-3">{step.title}</h4>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
