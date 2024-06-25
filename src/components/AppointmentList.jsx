import React, { useState, useEffect } from "react";
import AppointmentModal from "./AppointmentModal";
import EditAppointmentModal from "./EditAppointmentModal";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [csrfToken, setCsrfToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchCSRFToken();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:8000/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error.message);
    }
  };

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

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      if (!selectedAppointment) {
        throw new Error("Nessun appuntamento selezionato");
      }

      console.log("Aggiornamento appuntamento:", updatedAppointment);

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
      console.log("Dati aggiornati:", updatedData);

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

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("it-IT", options);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleShowModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleShowEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

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
              <strong>Data:</strong> {formatDate(appointment.date)} <br />
              <strong>Ora:</strong> {appointment.time} <br />
              {appointment.barber ? (
                <>
                  <strong>Parrucchiere:</strong> {appointment.barber.name}{" "}
                  <br />
                  {appointment.barber.photo && (
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
                <em>Parrucchiere non specificato</em>
              )}
            </div>
            <div>
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
  );
};

export default AppointmentList;
