import React, { useState, useEffect } from "react";
import AppointmentModal from "./AppointmentModal";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [csrfToken, setCsrfToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("Prenotazione cancellata con successo");
      setShowModal(false); // Chiude il modal dopo la cancellazione
    } catch (error) {
      console.error("Errore durante la cancellazione:", error.message);
    }
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
              <strong>Parrucchiere:</strong> {appointment.barber.name} <br />
              {appointment.barber.photo && (
                <img
                  src={appointment.barber.photo}
                  alt={appointment.barber.name}
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              )}
            </div>
            <button
              className="btn btn-danger"
              onClick={() => handleShowModal(appointment)}
            >
              Cancella
            </button>
          </div>
        ))}
      </div>
      <AppointmentModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={() => handleDelete(selectedAppointment.id)}
        message="Sei sicuro di voler cancellare la prenotazione?"
      />
      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
