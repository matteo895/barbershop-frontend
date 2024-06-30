import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ onLogin, logoutSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulazione del login per utente e admin senza backend
    if (email === "ciao@ciao.com" && password === "utente123") {
      const user = { email, role: "user" };
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      setLoginSuccess(true);
      setTimeout(() => {
        window.location.href = "/"; // Redirect dopo il login
      });
    } else if (
      email === "addio@addio.com" &&
      password === "amministratore123"
    ) {
      const user = { email, role: "admin" };
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      setLoginSuccess(true);
      setTimeout(() => {
        window.location.href = "/backoffice"; // Redirect dopo il login
      });
    } else {
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 2000);
    }
  };

  return (
    <div className="login-container">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card-login  rounded-lg my-5">
              <div className="card-body p-5 ">
                <h3 className="text-center mb-4 text-white">LOGIN</h3>
                {logoutSuccess && (
                  <p className="text-success">Logout avvenuto con successo!</p>
                )}
                <form onSubmit={handleLogin}>
                  {loginError && (
                    <p className="text-danger">
                      Email o password errati. Riprova.
                    </p>
                  )}
                  {loginSuccess && (
                    <p className="text-success">Login avvenuto con successo!</p>
                  )}
                  <div className="form-group ">
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
                    LOGIN
                  </button>
                  <div className="text-center mt-4">
                    <Link to="/register">
                      Non hai un account? Registrati qui.
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
