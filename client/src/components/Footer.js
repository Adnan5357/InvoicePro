import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3">
              <span className="text-primary">Invoice</span> Pro
            </h5>
            <p>
              Professional invoice management made simple. Trusted by thousands of businesses worldwide.
            </p>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3">Product</h6>
            <ul className="list-unstyled">
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#pricing" className="footer-link">Pricing</a></li>
              <li><a href="#" className="footer-link">Updates</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><a href="#about" className="footer-link">About</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Privacy</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-4">
            <h6 className="fw-bold mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Terms</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4 border-secondary" />
        
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">
              © {new Date().getFullYear()} Invoice Pro. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">
              Made with ❤️ for businesses worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
