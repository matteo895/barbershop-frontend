import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Importa useParams per ottenere i parametri URL
import Footer from "./Footer"; // Importa il componente Footer

const BarberAppointment = () => {
  // Ottieni l'ID del barbiere dai parametri URL
  const { barberId } = useParams();

  // Definisce lo stato del componente
  const [appointments, setAppointments] = useState([]); // Stato per memorizzare le prenotazioni
  const [barber, setBarber] = useState(null); // Stato per memorizzare i dettagli del barbiere

  // Effetto per ottenere i dettagli del barbiere e le prenotazioni quando il componente viene montato o quando barberId cambia
  useEffect(() => {
    fetchBarber(); // Chiama la funzione per ottenere i dettagli del barbiere
    fetchAppointments(); // Chiama la funzione per ottenere le prenotazioni
  }, [barberId]);

  // Funzione per ottenere i dettagli del barbiere dal server
  const fetchBarber = async () => {
    try {
      const response = await fetch(`http://localhost:8000/barbers`); // Effettua una richiesta GET all'endpoint del barbiere
      if (!response.ok) {
        throw new Error("Errore nel recupero del barbiere"); // Lancia un errore se la risposta non è OK
      }
      const data = await response.json(); // Estrai i dati dalla risposta
      setBarber(data); // Imposta i dettagli del barbiere nello stato
    } catch (error) {
      console.error("Errore nel recupero del barbiere:", error.message); // Stampa un messaggio di errore in caso di fallimento
    }
  };

  // Funzione per ottenere le prenotazioni dal server
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/barbers/${barberId}/appointments`
      ); // Effettua una richiesta GET all'endpoint delle prenotazioni del barbiere
      if (!response.ok) {
        throw new Error("Errore nel recupero delle prenotazioni"); // Lancia un errore se la risposta non è OK
      }
      const data = await response.json(); // Estrai i dati dalla risposta
      setAppointments(data); // Imposta le prenotazioni nello stato
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error.message); // Stampa un messaggio di errore in caso di fallimento
    }
  };

  // Funzione per formattare la data in un formato leggibile
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", options); // Ritorna la data formattata
  };

  // Se i dettagli del barbiere non sono ancora stati caricati, mostra un messaggio di caricamento
  if (!barber) {
    return <div>Loading...</div>; // Gestione del caricamento
  }

  return (
    <>
      <div className="text-white mt-5">
        <div className="appointment-card-container">
          {/* Mappa la lista delle prenotazioni e crea una card per ciascuna */}
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="appointment-card col-md-4 mb-5 mt-5"
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
      <Footer /> {/* Componente Footer */}
    </>
  );
};

export default BarberAppointment;
