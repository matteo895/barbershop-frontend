import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    // Simulazione della registrazione senza backend
    if (email && password) {
      const user = { email, role: "user" };
      localStorage.setItem("user", JSON.stringify(user));
      setRegisterSuccess(true);
      setTimeout(() => {
        window.location.href = "/"; // Redirect alla home dopo la registrazione
      }, 2000);
    } else {
      setRegisterError(true);
      setTimeout(() => {
        setRegisterError(false);
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8">
              <div className="card-login rounded-lg my-5">
                <div className="card-body p-5">
                  <h3 className="text-center mb-4 text-white">REGISTRATI</h3>
                  <form onSubmit={handleRegister}>
                    {registerError && (
                      <p className="text-danger">
                        Registrazione fallita. Riprova.
                      </p>
                    )}
                    {registerSuccess && (
                      <p className="text-success">
                        Registrazione avvenuta con successo!
                      </p>
                    )}
                    <div className="form-group">
                      <label htmlFor="email" className="mb-2 text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control mb-3"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="password" className="mb-2 text-white">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary shadow-button mt-4 w-100"
                    >
                      REGISTRATI
                    </button>
                    <div className="text-center mt-3">
                      <Link to="/Login">Hai già un account? Accedi qui.</Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
