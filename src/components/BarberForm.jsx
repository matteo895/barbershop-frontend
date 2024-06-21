// Importa le librerie necessarie
import React, { useState, useEffect } from "react";

const BarberForm = ({ onBarberAdded }) => {
  // Definisce gli stati locali
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [csrfToken, setCSRFToken] = useState("");

  // Esegue la chiamata per ottenere il token CSRF all'inizio
  useEffect(() => {
    fetchCSRFToken();
  }, []);

  // Funzione per ottenere il token CSRF dal server
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include",
      });
      const data = await response.json();
      setCSRFToken(data.csrfToken);
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error.message);
    }
  };

  // Funzione per gestire il submit del modulo
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBarber = { name, photo, description };

    try {
      const response = await fetch("http://localhost:8000/barbers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(newBarber),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Errore nella creazione del parrucchiere");
      }

      // Chiama la funzione passata come prop per aggiornare la lista dei parrucchieri nel componente genitore
      onBarberAdded();

      // Resetta i campi del modulo
      setName("");
      setPhoto("");
      setDescription("");
    } catch (error) {
      console.error(
        "Errore durante la creazione del parrucchiere:",
        error.message
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Modulo Parrucchiere (Back-office)</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Foto URL:</label>
          <input
            type="text"
            className="form-control"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descrizione:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Salva
        </button>
      </form>
    </div>
  );
};

export default BarberForm;
