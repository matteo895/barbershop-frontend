import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const ResetPassword = () => {
  // Stato per gestire l'email inserita dall'utente
  const [email, setEmail] = useState("");
  // Stato per gestire il reindirizzamento alla pagina di login dopo il reset della password
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  // Funzione per gestire il reset della password
  const handleResetPassword = async (e) => {
    e.preventDefault(); // Impedisce il comportamento predefinito del submit del form
    try {
      // Chiamata API per richiedere il reset della password
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Dati da inviare al server
      });
      if (response.ok) {
        // Se la richiesta va a buon fine, reindirizza alla pagina di login
        setRedirectToLogin(true);
      } else {
        // Gestione errore nel caso la richiesta fallisca
        console.error("Reset password request failed");
      }
    } catch (error) {
      // Gestione errore nel caso di problemi di rete o altri errori
      console.error("Reset password request failed", error);
    }
  };

  // Se redirectToLogin è true, reindirizza alla pagina di login
  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  // Renderizza il form per il reset della password
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Reset Password</div>
            <div className="card-body">
              <form onSubmit={handleResetPassword}>
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
                <button type="submit" className="btn btn-primary">
                  Send Password Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
