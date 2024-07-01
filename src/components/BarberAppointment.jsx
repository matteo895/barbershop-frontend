import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";

const BarberAppointment = () => {
  const { barberId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [barber, setBarber] = useState(null); // Stato per memorizzare i dettagli del barbiere

  useEffect(() => {
    fetchBarber();
    fetchAppointments();
  }, [barberId]);

  const fetchBarber = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/barbers/${barberId}/appointments`
      );
      if (!response.ok) {
        throw new Error("Errore nel recupero del barbiere");
      }
      const data = await response.json();
      setBarber(data); // Imposta i dettagli del barbiere
    } catch (error) {
      console.error("Errore nel recupero del barbiere:", error.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/barbers/${barberId}/appointments`
      );
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
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", options);
  };

  if (!barber) {
    return <div>Loading...</div>; // Gestione del caricamento
  }

  return (
    <>
      <div className="text-white mt-5">
        <div className="appointment-card-container">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="appointment-card col-md-4 mb-5 mt-5 box-shadow-2"
            >
              <h2 className="text-center mb-5" style={{ fontWeight: "bold" }}>
                APPUNTAMENTI DI : {appointment.name}
              </h2>

              <div className="card bg-secondary text-white mb-3">
                <div className="card-body">
                  <h5 className="card-title fs-2">
                    {formatDate(appointment.date)}
                  </h5>
                  <p className="card-text">
                    <strong className="fs-3">Ora : {appointment.time} </strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BarberAppointment;
