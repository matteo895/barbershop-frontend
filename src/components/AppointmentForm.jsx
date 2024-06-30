import React, { useState, useEffect } from "react";
import AppointmentFormModal from "./AppointmentFormModal";

const AppointmentForm = () => {
  // Stati del componente
  const [barbers, setBarbers] = useState([]); // Lista dei parrucchieri disponibili
  const [selectedBarber, setSelectedBarber] = useState(null); // Parrucchiere selezionato per la prenotazione
  const [date, setDate] = useState(""); // Data dell'appuntamento
  const [time, setTime] = useState(""); // Ora dell'appuntamento
  const [csrfToken, setCsrfToken] = useState(""); // Token CSRF per le richieste al server
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Mese corrente per la visualizzazione del calendario
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Anno corrente per la visualizzazione del calendario
  const [modal, setModal] = useState({
    // Stato per il modale di conferma
    show: false,
    title: "",
    message: "",
  });

  // Orari disponibili per l'appuntamento
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

  // Effetti di caricamento iniziale
  useEffect(() => {
    fetchBarbers(); // Carica i parrucchieri disponibili
    fetchCSRFToken(); // Ottiene il token CSRF necessario per le richieste al server
  }, []);

  // Funzione per ottenere la lista dei parrucchieri disponibili dal server
  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json();
      setBarbers(data); // Imposta la lista di parrucchieri nello stato
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message);
    }
  };

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

  // Funzione per gestire la sottomissione del form di prenotazione
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se l'ora è già prenotata (attualmente simulato)
    if (isTimeAlreadyBooked(date, time)) {
      setModal({
        show: true,
        title: "Errore",
        message:
          "Questa ora è già stata prenotata. Per favore, seleziona un'altra ora.",
      });
      return;
    }

    const newAppointment = {
      user_id: 1, // ID dell'utente (simulato)
      barber_id: selectedBarber.id, // ID del parrucchiere selezionato
      name: selectedBarber.name, // Nome del parrucchiere selezionato
      date, // Data dell'appuntamento
      time, // Ora dell'appuntamento
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

      // Resetta i campi dopo la prenotazione riuscita
      setSelectedBarber(null);
      setDate("");
      setTime("");

      // Mostra il modale di successo
      setModal({
        show: true,
        title: "Successo",
        message: "Appuntamento creato con successo.",
      });
    } catch (error) {
      console.error("Errore durante la prenotazione:", error.message);

      // Mostra il modale di errore
      setModal({
        show: true,
        title: "Errore",
        message:
          "Questa ora è già stata prenotata. Per favore, seleziona un'altra ora.",
      });
    }
  };

  // Funzione fittizia per verificare se l'ora è già prenotata
  const isTimeAlreadyBooked = (selectedDate, selectedTime) => {
    return false; // In questo esempio, non c'è una vera verifica, quindi ritorna sempre false
  };

  // Funzione per generare i giorni del mese selezionato
  const generateDaysOfMonth = (month, year) => {
    const currentDate = new Date();
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
      const day = date.getDay();
      if (day >= 2 && day <= 6 && date >= currentDate) {
        const dateString = date.toISOString().split("T")[0];
        days.push({
          date: dateString,
          display: date.toLocaleDateString("it-IT", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
        });
      }
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  // Funzione per gestire il cambio del mese nel calendario
  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Funzione per gestire il click su un giorno nel calendario
  const handleDayClick = (selectedDate) => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay.toISOString().split("T")[0]);
  };

  // Genera i giorni del mese corrente
  const daysOfMonth = generateDaysOfMonth(currentMonth, currentYear);

  // Rendering del componente
  return (
    <div className="appo-form">
      <div className="container ">
        <h2 className="text-white mt-5 text-center fs-1">
          Prenota un Appuntamento
        </h2>
        {selectedBarber && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="barberName"
                className="form-label fs-5 text-white mb-3"
              >
                Parrucchiere Selezionato
              </label>
              <input
                type="text"
                className="form-control"
                id="barberName"
                value={selectedBarber.name}
                disabled
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="dateInput"
                className="form-label fs-5 text-white mb-3 mt-2"
              >
                Data dell'Appuntamento
              </label>
              <div className="d-flex ">
                <button
                  type="button"
                  className="btn btn-secondary me-2 shadow-button "
                  onClick={() => handleMonthChange(-1)}
                  disabled={
                    currentMonth === 0 &&
                    currentYear === new Date().getFullYear()
                  }
                >
                  Mese Precedente
                </button>
                <input
                  type="text"
                  className="form-control"
                  id="dateInput"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-secondary ms-2 shadow-button"
                  onClick={() => handleMonthChange(1)}
                >
                  Mese Successivo
                </button>
              </div>
              <div className="d-flex flex-wrap mt-2">
                {daysOfMonth.map((day) => (
                  <button
                    type="button"
                    key={day.date}
                    className={`btn btn-outline-primary m-1 box-shadow-button ${
                      date === day.date ? "active" : ""
                    }`}
                    onClick={() => handleDayClick(day.date)}
                  >
                    {day.display}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="timeInput"
                className="form-label fs-5 text-white mb-3"
              >
                Ora dell'Appuntamento
              </label>
              <select
                className="form-control"
                id="timeInput"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Seleziona un orario</option>
                {times.map((timeSlot) => (
                  <option key={timeSlot} value={timeSlot}>
                    {timeSlot}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary shadow-button mt-3 mb-3 px-3"
            >
              PRENOTA ORA
            </button>
          </form>
        )}
        <div className="mt-4 ">
          <div className="row">
            {barbers.map((barber) => (
              <div className="col-md-4" key={barber.id}>
                <div className="card mb-3 box-shadow-2 ">
                  <img
                    src={barber.photo}
                    className="card-img-top"
                    alt={barber.name}
                  />
                  <div className="card-body bg-secondary">
                    <h5 className="card-title text-white">{barber.name}</h5>
                    <p className="card-text text-white">{barber.description}</p>
                    <button
                      className="btn btn-primary shadow-button"
                      onClick={() => setSelectedBarber(barber)}
                    >
                      SCEGLI : {barber.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mostra il modale di conferma */}
        <AppointmentFormModal
          show={modal.show}
          handleClose={() => setModal({ ...modal, show: false })}
          title={modal.title}
          message={modal.message}
        />
      </div>
      <footer className="text-light py-3">
        <div className="container text-center">
          <p>&copy; 2024 Barbershop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppointmentForm;
