import React, { useState, useEffect } from "react";
import AppointmentModal from "./AppointmentModal";
import EditAppointmentModal from "./EditAppointmentModal";
import AppointmentFormModal from "./AppointmentFormModal"; // Importa il nuovo componente modale
import { isTimeAlreadyBooked } from "./AppointmentUtils"; // Importa una funzione di utilità per verificare se l'ora è già prenotata

const AppointmentList = () => {
  // Stati del componente
  const [appointments, setAppointments] = useState([]);
  const [csrfToken, setCsrfToken] = useState("");
  const [showModal, setShowModal] = useState(false); // Stato per mostrare il modale di conferma eliminazione
  const [showEditModal, setShowEditModal] = useState(false); // Stato per mostrare il modale di modifica prenotazione
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Stato per tenere traccia della prenotazione selezionata per modifica/eliminazione
  const [successMessage, setSuccessMessage] = useState(""); // Messaggio di successo da mostrare all'utente
  const [errorMessage, setErrorMessage] = useState(""); // Messaggio di errore da mostrare all'utente
  const [showFormModal, setShowFormModal] = useState(false); // Stato per mostrare il nuovo modale

  // Effetti che vengono eseguiti al caricamento del componente
  useEffect(() => {
    fetchAppointments(); // Carica le prenotazioni dal server
    fetchCSRFToken(); // Ottiene il token CSRF dal server
  }, []);

  // Funzione per ottenere il token CSRF dal server
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include",
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken); // Imposta il token CSRF nello stato
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error.message);
    }
  };

  // Funzione per caricare le prenotazioni dal server
  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:8000/appointments");
      const data = await response.json();
      setAppointments(data); // Imposta le prenotazioni nello stato
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error.message);
    }
  };

  // Funzione per gestire l'eliminazione di una prenotazione
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

      // Rimuove la prenotazione dalla lista visualizzata
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );

      // Mostra un messaggio di successo all'utente
      showSuccessMessage("Prenotazione cancellata con successo");

      // Chiude il modale di conferma eliminazione
      setShowModal(false);
    } catch (error) {
      console.error("Errore durante la cancellazione:", error.message);

      // Mostra un messaggio di errore all'utente
      showErrorMessage("Errore durante la cancellazione della prenotazione");
    }
  };

  // Funzione per aggiornare una prenotazione esistente
  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      if (!selectedAppointment) {
        throw new Error("Nessun appuntamento selezionato");
      }

      // Verifica se l'ora proposta è già stata prenotata da un altro utente
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

      // Esegue una richiesta PUT per aggiornare la prenotazione sul server
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

      // Se l'aggiornamento ha successo, aggiorna la lista delle prenotazioni visualizzata
      const updatedData = await response.json();
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === updatedData.id ? updatedData : appointment
      );
      setAppointments(updatedAppointments);

      // Mostra un messaggio di successo all'utente
      showSuccessMessage("Prenotazione aggiornata con successo");

      // Chiude il modale di modifica
      setShowEditModal(false);
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error.message);

      // Mostra un messaggio di errore all'utente
      showErrorMessage("Errore durante l'aggiornamento della prenotazione");
    }
  };

  // Funzione per mostrare un messaggio di successo per un certo periodo di tempo
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000); // Il messaggio viene nascosto dopo 5 secondi
  };

  // Funzione per mostrare un messaggio di errore per un certo periodo di tempo
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000); // Il messaggio viene nascosto dopo 5 secondi
  };

  // Funzione per formattare la data nel formato desiderato
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("it-IT", options);
  };

  // Gestore per chiudere il modale di visualizzazione dettagli prenotazione
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null); // Resettare la prenotazione selezionata
  };

  // Gestore per mostrare il modale di visualizzazione dettagli prenotazione
  const handleShowModal = (appointment) => {
    setSelectedAppointment(appointment); // Imposta la prenotazione selezionata per la visualizzazione dettagli
    setShowModal(true); // Mostra il modale
  };

  // Gestore per mostrare il modale di modifica prenotazione
  const handleShowEditModal = (appointment) => {
    setSelectedAppointment(appointment); // Imposta la prenotazione selezionata per la modifica
    setShowEditModal(true); // Mostra il modale di modifica
  };

  // Gestore per mostrare il modale di creazione nuova prenotazione
  const handleShowFormModal = () => {
    setShowFormModal(true); // Mostra il modale
  };

  // Gestore per chiudere il modale di creazione nuova prenotazione
  const handleCloseFormModal = () => {
    setShowFormModal(false); // Nasconde il modale
  };

  // Rendering del componente
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Elenco Prenotazioni</h2>
      <div className="list-group">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div>
              {/* Dettagli della prenotazione */}
              <strong>Data:</strong> {formatDate(appointment.date)} <br />
              <strong>Ora:</strong> {appointment.time} <br />
              {appointment.barber ? (
                // Se il parrucchiere è specificato, mostra le informazioni
                <>
                  <strong>Parrucchiere:</strong> {appointment.barber.name}{" "}
                  <br />
                  {appointment.barber.photo && (
                    // Se disponibile, mostra la foto del parrucchiere
                    <img
                      src={appointment.barber.photo}
                      alt={appointment.barber.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </>
              ) : (
                // Se il parrucchiere non è specificato, mostra un messaggio
                <em>Parrucchiere non specificato</em>
              )}
            </div>
            <div>
              {/* Pulsanti per modifica ed eliminazione */}
              <button
                className="btn btn-primary me-2"
                onClick={() => handleShowEditModal(appointment)}
              >
                Modifica
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleShowModal(appointment)}
              >
                Cancella
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modali */}
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
        appointments={appointments} // Passa le prenotazioni a EditAppointmentModal
        fetchAppointments={fetchAppointments}
      />
      <AppointmentFormModal
        show={showFormModal}
        handleClose={handleCloseFormModal}
        message={errorMessage || successMessage} // Mostra messaggio di errore o successo
      />

      {/* Messaggi di successo o errore */}
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
  );
};

export default AppointmentList;
