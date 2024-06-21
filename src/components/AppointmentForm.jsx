// Importazioni necessarie per il componente
import React, { useState, useEffect } from "react";

const AppointmentForm = () => {
  // Stati locali per memorizzare i dati
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  // Effetti per recuperare i parrucchieri e il token CSRF all'avvio del componente
  useEffect(() => {
    fetchBarbers();
    fetchCSRFToken();
  }, []);

  // Funzione per recuperare i parrucchieri dal server
  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json();
      setBarbers(data); // Imposta lo stato 'barbers' con i dati recuperati
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message);
    }
  };

  // Funzione per recuperare il token CSRF dal server
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include",
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken); // Imposta lo stato 'csrfToken' con il token recuperato
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error.message);
    }
  };

  // Funzione per gestire l'invio del modulo
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form

    const newAppointment = {
      user_id: 1, // Assumendo che l'ID dell'utente sia 1 per test, da sostituire con l'ID dell'utente corrente
      barber_id: selectedBarber.id,
      date,
      time,
    };

    try {
      const response = await fetch("http://localhost:8000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(newAppointment),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Errore nella prenotazione dell'appuntamento");
      }

      const result = await response.json();
      console.log("Appuntamento creato con successo:", result);

      // Resetta i campi del form dopo la prenotazione
      setSelectedBarber(null);
      setDate("");
      setTime("");
    } catch (error) {
      console.error("Errore durante la prenotazione:", error.message);
    }
  };

  return (
    <div className="container">
      <h2>Prenota un Appuntamento</h2>
      {selectedBarber && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="barberName" className="form-label">
              Parrucchiere Selezionato
            </label>
            <input
              type="text"
              className="form-control"
              id="barberName"
              value={selectedBarber.name}
              disabled // Campo disabilitato perché mostra solo informazioni
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dateInput" className="form-label">
              Data dell'Appuntamento
            </label>
            <input
              type="date"
              className="form-control"
              id="dateInput"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required // Rende il campo obbligatorio
            />
          </div>
          <div className="mb-3">
            <label htmlFor="timeInput" className="form-label">
              Ora dell'Appuntamento
            </label>
            <input
              type="time"
              className="form-control"
              id="timeInput"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required // Rende il campo obbligatorio
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Prenota
          </button>
        </form>
      )}
      <div className="mt-4">
        <h3>Parrucchieri Disponibili</h3>
        <div className="row">
          {barbers.map((barber) => (
            <div className="col-md-4" key={barber.id}>
              <div className="card mb-3">
                <img
                  src={barber.photo}
                  className="card-img-top"
                  alt={barber.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{barber.name}</h5>
                  <p className="card-text">{barber.description}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedBarber(barber)} // Imposta il parrucchiere selezionato
                  >
                    Prenota con {barber.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
