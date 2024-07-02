import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal"; // Importa il componente Modale da react-bootstrap
import Button from "react-bootstrap/Button"; // Importa il componente Pulsante da react-bootstrap
import Form from "react-bootstrap/Form"; // Importa il componente Form da react-bootstrap

const EditAppointmentModal = ({
  show,
  handleClose,
  handleUpdate,
  appointment,
  appointments, // Riceve le prenotazioni come props
  fetchAppointments,
}) => {
  // Stati del componente
  const [updatedAppointment, setUpdatedAppointment] = useState({
    id: appointment?.id || "", // Imposta l'id della prenotazione iniziale
    time: appointment?.time || "", // Imposta l'ora della prenotazione iniziale
    barber: appointment?.barber || null, // Imposta il parrucchiere della prenotazione iniziale
    date: appointment?.date || "",
  });

  const [csrfToken, setCsrfToken] = useState(""); // Stato per il token CSRF
  const [successMessage, setSuccessMessage] = useState(""); // Stato per il messaggio di successo
  const [errorMessage, setErrorMessage] = useState(""); // Stato per il messaggio di errore

  // Possibili orari per la prenotazione
  const times = [
    "08:30",
    "09:30",
    "10:30",
    "11:30",
    "12:30",
    "15:30",
    "16:30",
    "17:30",
    "18:30",
    "19:30",
  ];

  // Effetto per recuperare il token CSRF quando cambia l'appuntamento selezionato
  useEffect(() => {
    if (appointment) {
      setUpdatedAppointment({
        id: appointment.id,
        time: appointment.time,
        barber: appointment.barber || null,
        date: appointment.date,
      });
    }
    fetchCSRFToken(); // Ottiene il token CSRF dal server
  }, [appointment]);

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

  // Funzione per gestire la sottomissione del form di modifica
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se l'ora è già prenotata
    if (
      isTimeAlreadyBooked(
        appointments,
        updatedAppointment.date,
        updatedAppointment.time
      )
    ) {
      setErrorMessage(
        "Questa ora è già stata prenotata. Per favore, seleziona un'altra ora."
      );
      return;
    }

    try {
      const { id, time, barber, date } = updatedAppointment;
      const requestBody = { id, time, barber_id: barber.id, date };

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

      const updatedData = await response.json();
      console.log("Dati aggiornati:", updatedData);

      setUpdatedAppointment(updatedData); // Aggiorna lo stato con i dati aggiornati
      setSuccessMessage("Prenotazione aggiornata con successo");
      fetchAppointments("");
      setTimeout(() => setSuccessMessage(""), 5000); // Nasconde il messaggio di successo dopo 5 secondi
      handleClose(); // Chiude il modale di modifica
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error.message);
      setErrorMessage(
        "Questa ora è già stata prenotata. Per favore, seleziona un'altra ora."
      );
    }
  };

  // Funzione per verificare se l'ora è già prenotata
  const isTimeAlreadyBooked = (selectedDate, selectedTime) => {
    // Verifica se l'orario è già prenotato confrontando con le prenotazioni esistenti
    const existingAppointment = appointments.find(
      (appointment) =>
        appointment.date === selectedDate && appointment.time === selectedTime
    );

    // Restituisce true se l'orario è già stato prenotato, altrimenti false
    return existingAppointment ? true : false;
  };

  // Rendering del componente
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Appuntamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="important-message">
          <strong>
            In questa sezione è possibile modificare solo l'ora della
            prenotazione. <br />
            Se desideri fare ulteriori modifiche, è consigliabile cancellare la
            prenotazione esisitente per ricrearla nella sezione Prenota.
          </strong>
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="timeInput">
            <Form.Label>Ora dell'Appuntamento</Form.Label>
            <Form.Control
              as="select"
              value={updatedAppointment.time}
              onChange={(e) =>
                setUpdatedAppointment({
                  ...updatedAppointment,
                  time: e.target.value,
                })
              }
              required
            >
              <option value="">Seleziona un orario</option>
              {times.map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {successMessage}
            </div>
          )}
          <Button
            variant="primary"
            type="submit"
            className="mt-3 shadow-button"
          >
            Salva Modifiche
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditAppointmentModal;
