// Importa le librerie necessarie
import React, { useState, useEffect } from "react";
import BarberForm from "./BarberForm";

const BackOffice = () => {
  // Definisce gli stati locali
  const [barbers, setBarbers] = useState([]);
  const [csrfToken, setCSRFToken] = useState("");
  const [editingBarber, setEditingBarber] = useState(null);

  // Esegue le chiamate per ottenere il token CSRF e la lista dei parrucchieri all'inizio
  useEffect(() => {
    fetchCSRFToken();
    fetchBarbers();
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

  // Funzione per ottenere la lista dei parrucchieri dal server
  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message);
    }
  };

  // Funzione per aggiornare la lista dei parrucchieri dopo l'aggiunta di un nuovo parrucchiere
  const handleBarberAdded = () => {
    fetchBarbers();
  };

  // Funzione per eliminare un parrucchiere
  const handleDeleteBarber = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/barbers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Errore nella cancellazione del parrucchiere");
      }

      fetchBarbers();
    } catch (error) {
      console.error(
        "Errore durante la cancellazione del parrucchiere:",
        error.message
      );
    }
  };

  // Funzione per aggiornare un parrucchiere esistente
  const handleUpdateBarber = async (id, updatedBarber) => {
    try {
      const response = await fetch(`http://localhost:8000/barbers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(updatedBarber),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento del parrucchiere");
      }

      fetchBarbers();
      setEditingBarber(null);
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento del parrucchiere:",
        error.message
      );
    }
  };

  // Funzione per avviare la modifica di un parrucchiere
  const startEditing = (barber) => {
    setEditingBarber(barber);
  };

  // Funzione per annullare la modifica di un parrucchiere
  const cancelEditing = () => {
    setEditingBarber(null);
  };

  return (
    <div className="container mt-4">
      <h1>Back Office</h1>
      <BarberForm onBarberAdded={handleBarberAdded} />
      <h2 className="mt-4">Lista Parrucchieri</h2>
      <div className="row">
        {barbers.map((barber) => (
          <div key={barber.id} className="col-md-4 mb-3">
            <div className="card">
              <img
                src={barber.photo}
                className="card-img-top"
                alt={barber.name}
              />
              <div className="card-body">
                <h5 className="card-title">{barber.name}</h5>
                <p className="card-text">{barber.description}</p>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => startEditing(barber)}
                >
                  Modifica
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteBarber(barber.id)}
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingBarber && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifica Parrucchiere</h5>
                <button type="button" className="close" onClick={cancelEditing}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateBarber(editingBarber.id, editingBarber);
                  }}
                >
                  <div className="form-group">
                    <label>Nome:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBarber.name}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Foto URL:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBarber.photo}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          photo: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Descrizione:</label>
                    <textarea
                      className="form-control"
                      value={editingBarber.description}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Salva
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEditing}
                  >
                    Annulla
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackOffice;
