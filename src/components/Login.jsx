import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const Login = () => {
  // Stati per gestire l'email, la password e il reindirizzamento alla dashboard
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  // Funzione per gestire il login dell'utente
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita il comportamento predefinito del form

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Invia le credenziali come JSON
      });

      if (response.ok) {
        // Se la risposta è positiva, reindirizza alla dashboard
        setRedirectToDashboard(true);
      } else {
        // Se il login fallisce, gestisci l'errore
        console.error("Login failed");
      }
    } catch (error) {
      // Se si verifica un errore durante il login, gestiscilo
      console.error("Login failed", error);
    }
  };

  // Se redirectToDashboard è true, reindirizza l'utente alla dashboard
  if (redirectToDashboard) {
    return <Redirect to="/dashboard" />;
  }

  // Renderizza il form di login
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
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
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
