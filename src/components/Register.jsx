import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const Register = () => {
  // Stati per gestire i dati del form e il reindirizzamento
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  // Funzione per gestire la registrazione dell'utente
  const handleRegister = async (e) => {
    e.preventDefault(); // Impedisce il comportamento predefinito del submit del form
    try {
      // Chiamata API per registrare l'utente
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }), // Dati da inviare al server
      });
      if (response.ok) {
        // Se la registrazione va a buon fine, reindirizza alla dashboard
        setRedirectToDashboard(true);
      } else {
        // Gestione errore nel caso la registrazione fallisca
        console.error("Registration failed");
      }
    } catch (error) {
      // Gestione errore nel caso di problemi di rete o altri errori
      console.error("Registration failed", error);
    }
  };

  // Se redirectToDashboard è true, reindirizza alla dashboard
  if (redirectToDashboard) {
    return <Redirect to="/dashboard" />;
  }

  // Renderizza il form di registrazione
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
