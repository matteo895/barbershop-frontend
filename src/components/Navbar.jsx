import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Controlla se l'utente è loggato

  return (
    <nav className="navbar nav-very navbar-expand-lg navbar-dark ">
      <div className="container">
        <Link className="navbar-brand my-1" to="/">
          <img
            src="/images/barber24.jpg"
            alt="logo"
            style={{
              width: "11rem",
              height: "5rem",
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
            <li className="nav-item nav-b">
              <Link className="nav-link fs-4 " to="/">
                HOME
              </Link>
            </li>
            <li className="nav-item nav-b">
              <Link className="nav-link fs-4 " to="/AppointmentForm">
                PRENOTA
              </Link>
            </li>
            <li className="nav-item nav-b">
              <Link className="nav-link fs-4" to="/AppointmentList">
                LISTA
              </Link>
            </li>
            <li className="nav-item nav-b">
              <Link className="nav-link fs-4" to="/BackOffice">
                BACKOFFICE
              </Link>
            </li>
            <li className="nav-item nav-b">
              <Link className="nav-link fs-4" to="/UserProfile">
                ACCOUNT
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
