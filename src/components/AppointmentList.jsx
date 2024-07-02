import React, { useState, useEffect } from "react";
import AppointmentModal from "./AppointmentModal";
import EditAppointmentModal from "./EditAppointmentModal";
import AppointmentFormModal from "./AppointmentFormModal";
import { isTimeAlreadyBooked } from "./AppointmentUtils";
import Footer from "./Footer";

// Componente principale per la gestione della lista delle prenotazioni
const AppointmentList = () => {
  // Stato per memorizzare le prenotazioni
  const [appointments, setAppointments] = useState([]);
  // Stato per memorizzare il token CSRF
  const [csrfToken, setCsrfToken] = useState("");
  // Stato per gestire la visibilità della modale di conferma eliminazione
  const [showModal, setShowModal] = useState(false);
  // Stato per gestire la visibilità della modale di modifica appuntamento
  const [showEditModal, setShowEditModal] = useState(false);
  // Stato per memorizzare l'appuntamento selezionato
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // Stato per memorizzare i messaggi di successo
  const [successMessage, setSuccessMessage] = useState("");
  // Stato per memorizzare i messaggi di errore
  const [errorMessage, setErrorMessage] = useState("");
  // Stato per gestire la visibilità della modale del form di appuntamento
  const [showFormModal, setShowFormModal] = useState(false);

  // Effetto per recuperare le prenotazioni e il token CSRF al montaggio del componente
  useEffect(() => {
    fetchAppointments();
    fetchCSRFToken();
  }, []);

  // Funzione per recuperare il token CSRF dal server
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include",
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error.message);
    }
  };

  // Funzione per recuperare le prenotazioni dal server
  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:8000/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error.message);
    }
  };

  // Funzione per gestire l'eliminazione di un appuntamento
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Errore nella cancellazione della prenotazione");
      }

      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );

      showSuccessMessage("Prenotazione cancellata con successo");

      setShowModal(false);
    } catch (error) {
      console.error("Errore durante la cancellazione:", error.message);
      showErrorMessage("Errore durante la cancellazione della prenotazione");
    }
  };

  // Funzione per gestire l'aggiornamento di un appuntamento
  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      if (!selectedAppointment) {
        throw new Error("Nessun appuntamento selezionato");
      }

      // Controllo se l'orario è già prenotato
      if (
        isTimeAlreadyBooked(
          appointments,
          updatedAppointment.date,
          updatedAppointment.time
        )
      ) {
        showErrorMessage(
          "Questa ora è già stata prenotata. Per favore, seleziona un'altra ora."
        );
        return;
      }

      const { id, time, barber_id } = updatedAppointment;

      const requestBody = {
        time,
        barber_id,
      };

      const response = await fetch(`http://localhost:8000/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errore nella risposta del server:", errorData);
        throw new Error("Errore nell'aggiornamento della prenotazione");
      }

      const updatedData = await response.json();
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === updatedData.id ? updatedData : appointment
      );
      setAppointments(updatedAppointments);

      showSuccessMessage("Prenotazione aggiornata con successo");

      setShowEditModal(false);
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error.message);
      showErrorMessage("Errore durante l'aggiornamento della prenotazione");
    }
  };

  // Funzione per mostrare un messaggio di successo
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  // Funzione per mostrare un messaggio di errore
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("it-IT", options);
  };

  // Funzione per chiudere la modale di conferma eliminazione
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Funzione per mostrare la modale di conferma eliminazione
  const handleShowModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Funzione per mostrare la modale di modifica appuntamento
  const handleShowEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  // Funzione per chiudere la modale del form di appuntamento
  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  return (
    <>
      <div className="appo-list">
        <div className="container mt-5 mb-5">
          <h2
            className="mb-4 fs-1 text-white text-center mb-5"
            style={{ fontWeight: "bold" }}
          >
            Elenco Prenotazioni
          </h2>
          <div className="appointment-card-container">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="appointment-card box-shadow-2"
              >
                <div className="appointment-card-body d-flex">
                  {appointment.barber?.photo && (
                    <img
                      src={`http://localhost:8000${appointment.barber.photo}`}
                      alt={appointment.barber.name}
                      className="appointment-card-img"
                    />
                  )}
                  <div className="appointment-card-content">
                    <h5 className="card-title text-white">
                      {formatDate(appointment.date)}
                    </h5>
                    <p className="card-text fs-5">
                      <strong>Ora:</strong> {appointment.time} <br />
                      <strong>Parrucchiere:</strong>{" "}
                      {appointment.barber?.name || (
                        <em>Parrucchiere non specificato</em>
                      )}
                    </p>
                  </div>

                  <div className="card-actions ms-auto">
                    <button
                      className="btn edit-btn shadow-button edit-btn "
                      onClick={() => handleShowEditModal(appointment)}
                    >
                      Modifica
                    </button>
                    <button
                      className="btn delete-btn shadow-button"
                      onClick={() => handleShowModal(appointment)}
                    >
                      Cancella
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AppointmentModal
            show={showModal}
            handleClose={handleCloseModal}
            handleConfirm={() => handleDelete(selectedAppointment.id)}
            message="Sei sicuro di voler cancellare la prenotazione?"
          />
          <EditAppointmentModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            handleUpdate={handleUpdateAppointment}
            appointment={selectedAppointment}
            appointments={appointments}
            fetchAppointments={fetchAppointments}
          />
          <AppointmentFormModal
            show={showFormModal}
            handleClose={handleCloseFormModal}
            message={errorMessage || successMessage}
          />

          {successMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentList;
