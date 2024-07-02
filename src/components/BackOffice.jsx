import React, { useState, useEffect } from "react";
import BarberForm from "./BarberForm";
import Footer from "./Footer";

const BackOffice = () => {
  const [barbers, setBarbers] = useState([]);
  const [csrfToken, setCSRFToken] = useState("");
  const [editingBarber, setEditingBarber] = useState(null);

  useEffect(() => {
    fetchCSRFToken();
    fetchBarbers();
  }, []);

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

  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message);
    }
  };

  const handleBarberAdded = () => {
    fetchBarbers();
  };

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

  const startEditing = (barber) => {
    setEditingBarber(barber);
  };

  const cancelEditing = () => {
    setEditingBarber(null);
  };

  return (
    <>
      <div className="back">
        <div className="container mt-4 ">
          <h1 className="text-center font-weight-bold fs-1 text-white mt-5">
            BACK OFFICE
          </h1>
          <BarberForm onBarberAdded={handleBarberAdded} />
          <h2 className="mt-4 text-center text-white fs-1 mb-5">
            Lista Parrucchieri
          </h2>
          <div className="row row-cols-1 row-cols-xl-3 row-cols-md-2 g-4 mb-5 ">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="col mb-5 "
                style={{ display: "flex" }}
              >
                <div className="card h-100 g-card-a  mx-2">
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
      <Footer />
    </>
  );
};

export default BackOffice;
