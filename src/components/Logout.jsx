import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  // Effetto che viene eseguito una sola volta al montaggio del componente
  useEffect(() => {
    // Funzione asincrona per gestire il logout
    const logout = async () => {
      try {
        // Chiamata API per effettuare il logout tramite POST a "/logout"
        await fetch("/logout", {
          method: "POST",
        });
      } catch (error) {
        // Gestione degli errori nel caso il logout fallisca
        console.error("Logout failed", error);
      }
    };

    // Chiamata alla funzione per eseguire il logout
    logout();
  }, []); // Array vuoto come dipendenza per eseguire l'effetto solo al montaggio del componente

  // Reindirizzamento alla homepage dopo il logout
  return <Navigate to="/" />;
};

export default Logout;
