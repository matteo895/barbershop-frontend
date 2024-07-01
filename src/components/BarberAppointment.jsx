import React, { useState, useEffect } from "react";

const BarberAppointment = ({ barber_id }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, [barber_id]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/barbers/${barber_id}/appointments`);
      if (!response.ok) {
        throw new Error("Errore nel recupero delle prenotazioni");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error.message);
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

  return (
    <>
      <h2>Appuntamenti di Oggi</h2>
      <div className="appointment-card-container">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="appointment-card-body">
              <p>
                <strong>Data:</strong> {formatDate(appointment.date)}
              </p>
              <p>
                <strong>Ora:</strong> {appointment.time}
              </p>
              <p>
                <strong>Parrucchiere:</strong> {appointment.barber.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BarberAppointment;
