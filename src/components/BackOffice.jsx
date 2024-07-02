import React, { useState, useEffect } from "react";
import BarberForm from "./BarberForm"; // Importa il componente BarberForm
import Footer from "./Footer"; // Importa il componente Footer

const BackOffice = () => {
  // Definisce gli stati del componente
  const [barbers, setBarbers] = useState([]); // Stato per memorizzare la lista dei parrucchieri
  const [csrfToken, setCSRFToken] = useState(""); // Stato per memorizzare il token CSRF
  const [editingBarber, setEditingBarber] = useState(null); // Stato per memorizzare il parrucchiere in fase di modifica

  // Effetto per ottenere il token CSRF e la lista dei parrucchieri quando il componente viene montato
  useEffect(() => {
    fetchCSRFToken(); // Chiama la funzione per ottenere il token CSRF
    fetchBarbers(); // Chiama la funzione per ottenere la lista dei parrucchieri
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

  // Funzione per ottenere la lista dei parrucchieri dal server
  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json(); // Estrai la lista dei parrucchieri dalla risposta
      setBarbers(data); // Imposta la lista dei parrucchieri nello stato
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message);
    }
  };

  // Funzione chiamata quando un parrucchiere viene aggiunto
  const handleBarberAdded = () => {
    fetchBarbers(); // Aggiorna la lista dei parrucchieri
  };

  // Funzione per cancellare un parrucchiere
  const handleDeleteBarber = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/barbers/${id}`, {
        method: "DELETE", // Metodo della richiesta DELETE
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken, // Imposta il token CSRF nell'header della richiesta
        },
        credentials: "include", // Includi le credenziali per la richiesta
      });

      if (!response.ok) {
        throw new Error("Errore nella cancellazione del parrucchiere");
      }

      fetchBarbers(); // Aggiorna la lista dei parrucchieri
    } catch (error) {
      console.error(
        "Errore durante la cancellazione del parrucchiere:",
        error.message
      );
    }
  };

  // Funzione per aggiornare un parrucchiere
  const handleUpdateBarber = async (id, updatedBarber) => {
    try {
      const response = await fetch(`http://localhost:8000/barbers/${id}`, {
        method: "PUT", // Metodo della richiesta PUT
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken, // Imposta il token CSRF nell'header della richiesta
        },
        body: JSON.stringify({
          name: updatedBarber.name, // Aggiorna il nome del parrucchiere
          description: updatedBarber.description, // Aggiorna la descrizione del parrucchiere
        }),
        credentials: "include", // Includi le credenziali per la richiesta
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento del parrucchiere");
      }

      fetchBarbers(); // Aggiorna la lista dei parrucchieri
      setEditingBarber(null); // Resetta lo stato di modifica del parrucchiere
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento del parrucchiere:",
        error.message
      );
    }
  };

  // Funzione per iniziare la modifica di un parrucchiere
  const startEditing = (barber) => {
    setEditingBarber(barber); // Imposta il parrucchiere da modificare nello stato
  };

  // Funzione per annullare la modifica del parrucchiere
  const cancelEditing = () => {
    setEditingBarber(null); // Resetta lo stato di modifica del parrucchiere
  };

  return (
    <>
      <div className="back">
        <div className="container mt-4">
          <h1 className="text-center font-weight-bold fs-1 text-white mt-5">
            BACK OFFICE
          </h1>
          <BarberForm onBarberAdded={handleBarberAdded} />{" "}
          {/* Componente BarberForm per aggiungere nuovi parrucchieri */}
          <h2 className="mt-4 text-center text-white fs-1 mb-5">
            Lista Parrucchieri
          </h2>
          <div className="row">
            {barbers.map((barber) => (
              <div key={barber.id} className="col-md-4 mb-3 g-appo-form">
                <div className="card box-shadow-2 g-form mb-4 mx-2">
                  <img
                    src={`http://localhost:8000${barber.photo}`}
                    className="card-img-top"
                    alt={barber.name}
                  />
                  <div className="card-body bg-color">
                    <h5 className="card-title text-center">{barber.name}</h5>
                    <p className="card-text text-dark text-center">
                      {barber.description}
                    </p>
                    <div className="card-actions">
                      <button
                        className="btn btn-primary shadow-button mx-1"
                        onClick={() => startEditing(barber)}
                      >
                        MODIFICA
                      </button>
                      <button
                        className="btn btn-danger shadow-button"
                        onClick={() => handleDeleteBarber(barber.id)}
                      >
                        ELIMINA
                      </button>
                    </div>
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
                    <button
                      type="button"
                      className="close"
                      onClick={cancelEditing}
                    >
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
                      <p className="important-message">
                        <strong>
                          In questa sezione è possibile modificare solo il
                          titolo e la descrizione dei parrucchieri. <br />
                          Se desideri fare ulteriori modifiche, è consigliabile
                          cancellare la card esistente per ricrearla.
                        </strong>
                      </p>
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
                      <div className="card-actions">
                        <button
                          type="submit"
                          className="btn btn-success shadow-button"
                        >
                          Salva
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary shadow-button"
                          onClick={cancelEditing}
                        >
                          Annulla
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer /> {/* Componente Footer */}
    </>
  );
};

export default BackOffice;
