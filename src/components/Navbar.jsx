import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Controlla se l'utente è loggato

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/images/barbershop12.jpg"
            alt="logo"
            style={{
              width: "8rem",
              height: "2.5rem",
            }}
          />
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AppointmentForm">
                Prenota
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AppointmentList">
                Lista
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/BackOffice">
                BACKOFFICE
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/UserProfile">
                Account
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
