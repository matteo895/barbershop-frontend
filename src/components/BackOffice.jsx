import React, { useState, useEffect } from "react";
import BarberForm from "./BarberForm"; // Importa il componente BarberForm per aggiungere un nuovo barbiere
import Footer from "./Footer"; // Importa il componente Footer

const BackOffice = () => {
  // Definisce lo stato del componente
  const [barbers, setBarbers] = useState([]); // Stato per memorizzare la lista dei barbieri
  const [csrfToken, setCSRFToken] = useState(""); // Stato per memorizzare il token CSRF
  const [editingBarber, setEditingBarber] = useState(null); // Stato per memorizzare il barbiere in fase di modifica

  // Effetto per ottenere il token CSRF e la lista dei barbieri quando il componente viene montato
  useEffect(() => {
    fetchCSRFToken(); // Chiama la funzione per ottenere il token CSRF
    fetchBarbers(); // Chiama la funzione per ottenere la lista dei barbieri
  }, []);

  // Funzione per ottenere il token CSRF dal server
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include",
      });
      const data = await response.json();
      setCSRFToken(data.csrfToken); // Imposta il token CSRF nello stato
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error.message); // Stampa un messaggio di errore in caso di fallimento
    }
  };

  // Funzione per ottenere la lista dei barbieri dal server
  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json();
      setBarbers(data); // Imposta la lista dei barbieri nello stato
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message); // Stampa un messaggio di errore in caso di fallimento
    }
  };

  // Funzione chiamata quando un nuovo barbiere viene aggiunto
  const handleBarberAdded = () => {
    fetchBarbers(); // Aggiorna la lista dei barbieri
  };

  // Funzione per cancellare un barbiere dal server
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
        throw new Error("Errore nella cancellazione del parrucchiere"); // Lancia un errore se la risposta non è OK
      }
      fetchBarbers(); // Aggiorna la lista dei barbieri
    } catch (error) {
      console.error(
        "Errore durante la cancellazione del parrucchiere:",
        error.message
      ); // Stampa un messaggio di errore in caso di fallimento
    }
  };

  // Funzione per aggiornare un barbiere sul server
  const handleUpdateBarber = async (id, updatedBarber) => {
    try {
      const response = await fetch(`http://localhost:8000/barbers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          name: updatedBarber.name,
          description: updatedBarber.description,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento del parrucchiere"); // Lancia un errore se la risposta non è OK
      }
      fetchBarbers(); // Aggiorna la lista dei barbieri
      setEditingBarber(null); // Termina la modalità di modifica
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento del parrucchiere:",
        error.message
      ); // Stampa un messaggio di errore in caso di fallimento
    }
  };

  // Funzione per avviare la modalità di modifica per un barbiere
  const startEditing = (barber) => {
    setEditingBarber(barber);
  };

  // Funzione per annullare la modalità di modifica
  const cancelEditing = () => {
    setEditingBarber(null);
  };

  return (
    <>
      <div className="back">
        <div className="container mt-4">
          <h1 className="text-center font-weight-bold fs-1 text-white mt-5">
            BACK OFFICE
          </h1>
          <BarberForm onBarberAdded={handleBarberAdded} />{" "}
          {/* Componente per aggiungere un nuovo barbiere */}
          <h2 className="mt-4 text-center text-white fs-1 mb-5">
            Lista Parrucchieri
          </h2>
          <div className="row row-cols-1 row-cols-xl-3 row-cols-md-2 g-4 mb-5">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="col mb-5"
                style={{ display: "flex" }}
              >
                <div className="card h-100 g-card-a mx-2">
                  <img
                    src={`http://localhost:8000${barber.photo}`}
                    className="card-img-top-a"
                    alt={barber.name}
                  />
                  <div className="card-body-a bg-color d-flex">
                    <h5 className="card-title text-center">{barber.name}</h5>
                    <p className="card-text text-dark text-center">
                      {barber.description}
                    </p>
                  </div>

                  <div className="card-actions-b bg-secondary">
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
            ))}
          </div>
          {/* Modale per modificare un barbiere */}
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
                        handleUpdateBarber(editingBarber.id, editingBarber); // Aggiorna il barbiere quando il form viene inviato
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
