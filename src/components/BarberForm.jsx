import React, { useState, useEffect } from "react";

const BarberForm = ({ onBarberAdded }) => {
  // Stati per gestire i campi del form e il token CSRF
  const [name, setName] = useState(""); // Nome del parrucchiere
  const [photo, setPhoto] = useState(null); // File foto del parrucchiere
  const [description, setDescription] = useState(""); // Descrizione del parrucchiere
  const [csrfToken, setCSRFToken] = useState(""); // Token CSRF per le richieste sicure

  // Effetto per ottenere il token CSRF quando il componente viene montato
  useEffect(() => {
    fetchCSRFToken(); // Chiamata alla funzione per ottenere il token CSRF
  }, []);

  // Funzione per ottenere il token CSRF dal server
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include", // Includi le credenziali per la richiesta
      });
      const data = await response.json(); // Estrai il token CSRF dalla risposta
      setCSRFToken(data.csrfToken); // Imposta il token CSRF nello stato
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error.message);
    }
  };

  // Funzione per gestire l'invio del form (aggiunta di un nuovo parrucchiere)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita il comportamento predefinito del form (ricaricamento della pagina)

    const formData = new FormData(); // Crea un oggetto FormData per inviare i dati
    formData.append("name", name); // Aggiungi il nome al formData
    formData.append("photo", photo); // Aggiungi la foto al formData
    formData.append("description", description); // Aggiungi la descrizione al formData

    try {
      // Effettua una richiesta POST per creare un nuovo parrucchiere
      const response = await fetch("http://localhost:8000/barbers", {
        method: "POST", // Metodo della richiesta POST
        headers: {
          "X-CSRF-TOKEN": csrfToken, // Imposta il token CSRF nell'header della richiesta
        },
        body: formData, // Imposta il corpo della richiesta con l'oggetto FormData
        credentials: "include", // Includi le credenziali per la richiesta
      });

      if (!response.ok) {
        throw new Error("Errore nella creazione del parrucchiere"); // Se la risposta non è OK, genera un errore
      }

      onBarberAdded(); // Chiamata alla funzione fornita per aggiornare la lista dei parrucchieri
      setName(""); // Resetta il campo del nome
      setPhoto(null); // Resetta il campo della foto
      setDescription(""); // Resetta il campo della descrizione
    } catch (error) {
      console.error(
        "Errore durante la creazione del parrucchiere:",
        error.message
      ); // Gestisce gli errori durante la creazione del parrucchiere
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-white fs-1">Modulo Aggiunta :</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label className="text-white mb-2 fs-5">Nome:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)} // Gestisce il cambiamento del valore del campo nome
            required
          />
        </div>
        <div className="form-group">
          <label className="text-white mb-2 mt-3 fs-5">Foto:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPhoto(e.target.files[0])} // Gestisce il cambiamento del file selezionato per la foto
            required
          />
        </div>
        <div className="form-group">
          <label className="text-white mb-2 mt-3 fs-5">Descrizione:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Gestisce il cambiamento del valore del campo descrizione
            required
          />
        </div>
        <div className="button-form">
          <button
            type="submit"
            className="btn btn-primary mt-4 shadow-button px-5"
          >
            SALVA
          </button>
        </div>
      </form>
    </div>
  );
};

export default BarberForm;
