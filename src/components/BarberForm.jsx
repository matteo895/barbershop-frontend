// Importazioni necessarie per il componente
import React, { useState, useEffect } from "react";

const BarberForm = ({ onSubmit, editingBarber, csrfToken }) => {
  // Stati locali per memorizzare i valori del modulo
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");

  // Effetto per aggiornare i campi del modulo quando si seleziona un parrucchiere da modificare
  useEffect(() => {
    if (editingBarber) {
      setName(editingBarber.name);
      setPhoto(editingBarber.photo);
      setDescription(editingBarber.description);
    } else {
      setName("");
      setPhoto("");
      setDescription("");
    }
  }, [editingBarber]);

  // Funzione per gestire l'invio del modulo
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form
    onSubmit({ id: editingBarber?.id, name, photo, description }); // Chiama la funzione onSubmit passando i dati del form
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)} // Aggiorna lo stato 'name' quando l'input cambia
          required // Rende il campo obbligatorio
        />
      </div>
      <div className="form-group">
        <label>Foto URL:</label>
        <input
          type="text"
          className="form-control"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)} // Aggiorna lo stato 'photo' quando l'input cambia
          required // Rende il campo obbligatorio
        />
      </div>
      <div className="form-group">
        <label>Descrizione:</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Aggiorna lo stato 'description' quando l'input cambia
          required // Rende il campo obbligatorio
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {editingBarber ? "Modifica" : "Aggiungi"}
      </button>
    </form>
  );
};

export default BarberForm;
