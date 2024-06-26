import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const Register = () => {
  // Stati per gestire i campi del form di registrazione e il reindirizzamento
  const [name, setName] = useState(""); // Nome dell'utente
  const [email, setEmail] = useState(""); // Email dell'utente
  const [password, setPassword] = useState(""); // Password dell'utente
  const [navigateToLogin, setNavigateToLogin] = useState(false); // Flag per reindirizzare alla pagina di login dopo la registrazione
  const [csrfToken, setCSRFToken] = useState(""); // CSRF token per la sicurezza delle richieste

  // useEffect per recuperare il CSRF token al caricamento del componente
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/csrf-token");
        const data = await response.json();
        if (response.ok) {
          setCSRFToken(data.csrfToken); // Imposta il CSRF token nello stato
        } else {
          throw new Error("Failed to fetch CSRF token");
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    fetchCSRFToken(); // Esegue la funzione fetchCSRFToken al montaggio del componente
  }, []);

  // Funzione per gestire la registrazione dell'utente
  const handleRegister = async (e) => {
    e.preventDefault(); // Evita il comportamento predefinito del submit del form

    try {
      // Esegue una richiesta POST al server per registrare l'utente
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Tipo di contenuto della richiesta
          "X-CSRF-TOKEN": csrfToken, // CSRF token per la sicurezza della richiesta
        },
        body: JSON.stringify({ name, email, password }), // Dati del form in formato JSON
      });

      // Se la registrazione è avvenuta con successo, imposta il reindirizzamento alla pagina di login
      if (response.ok) {
        setNavigateToLogin(true);
      } else {
        console.error("Registration failed"); // Se la registrazione non è riuscita, logga l'errore
      }
    } catch (error) {
      console.error("Registration failed", error); // Se si verifica un errore durante la richiesta, logga l'errore
    }
  };

  // Se navigateToLogin è true, reindirizza alla pagina di login usando Navigate di react-router-dom
  if (navigateToLogin) {
    return <Navigate to="/login" />;
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
