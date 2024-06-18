import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="contact-info">
              <p>Indirizzo: Via delle forbici, 123 - Città</p>
              <p>Tel: 0123 456789</p>
              <p>Email: info@barbershop.com</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="footer-links">
              <ul>
                <li>
                  <a href="#">Termini e Condizioni</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
