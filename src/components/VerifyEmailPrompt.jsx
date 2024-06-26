import React from "react";
import { Navigate } from "react-router-dom";

const VerifyEmailPrompt = ({ user }) => {
  // Controlla se l'utente esiste e se l'email è verificata
  if (user && user.email_verified_at) {
    // Se l'email è verificata, reindirizza l'utente alla dashboard
    return <Navigate to="/dashboard" />;
  }

  // Se l'email non è verificata, mostra un messaggio di verifica richiesta
  return (
    <div>
      <h2>Email Verification Required</h2>
      <p>Please verify your email to continue.</p>
    </div>
  );
};

export default VerifyEmailPrompt;
