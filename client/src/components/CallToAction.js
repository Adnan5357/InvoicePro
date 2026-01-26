import React from 'react';
import '../styles/CallToAction.css';

const CallToAction = () => {
  const handleSignUp = () => {
    // Placeholder - UI only
    console.log('Sign Up clicked from CTA');
  };

  return (
    <section id="pricing" className="cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="cta-title">Ready to Transform Your Invoicing?</h2>
              <p className="cta-subtitle">
                Join thousands of businesses already using Invoice Pro. Start your free trial today - 
                no credit card required, cancel anytime.
              </p>
            </div>
            <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
              <button 
                className="btn btn-success btn-lg px-5"
                onClick={handleSignUp}
              >
                Start Free Trial
              </button>
              <p className="cta-note mt-2">14-day free trial • No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
