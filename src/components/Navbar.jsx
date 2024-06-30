import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ loggedInUser, onLogout }) => {
  const logoutHandler = () => {
    localStorage.removeItem("user");
    onLogout();
  };

  return (
    <nav className="navbar nav-very navbar-expand-lg navbar-dark ">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/images/barber24.jpg"
            alt="logo"
            style={{ width: "11rem", height: "5rem" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {loggedInUser && loggedInUser.role === "user" && (
              <>
                <li className="nav-item nav-b">
                  <Link className="nav-link " to="/">
                    HOME
                  </Link>
                </li>
                <li className="nav-item nav-b">
                  <Link className="nav-link" to="/AppointmentForm">
                    PRENOTA
                  </Link>
                </li>
                <li className="nav-item nav-b">
                  <Link className="nav-link" to="/AppointmentList">
                    LISTA
                  </Link>
                </li>
              </>
            )}
            {loggedInUser && loggedInUser.role === "admin" && (
              <li className="nav-item nav-b">
                <Link className="nav-link" to="/BackOffice">
                  BACKOFFICE
                </Link>
              </li>
            )}
            {loggedInUser && (
              <li className="nav-item nav-b">
                <button
                  className="btn btn-link nav-link "
                  onClick={logoutHandler}
                >
                  LOGOUT
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
