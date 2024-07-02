import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import del hook useNavigate per la navigazione
import AppointmentFormModal from "./AppointmentFormModal";
import Footer from "./Footer";

// Definizione del componente AppointmentForm
const AppointmentForm = () => {
  const navigate = useNavigate(); // Utilizzo del hook useNavigate per la navigazione tra le pagine

  // Definizione degli stati utilizzati nel componente
  const [barbers, setBarbers] = useState([]); // Stato per memorizzare la lista dei parrucchieri
  const [selectedBarber, setSelectedBarber] = useState(null); // Stato per memorizzare il parrucchiere selezionato
  const [date, setDate] = useState(""); // Stato per memorizzare la data dell'appuntamento
  const [time, setTime] = useState(""); // Stato per memorizzare l'ora dell'appuntamento
  const [csrfToken, setCsrfToken] = useState(""); // Stato per memorizzare il token CSRF
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Stato per memorizzare il mese corrente
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Stato per memorizzare l'anno corrente
  const [modal, setModal] = useState({
    // Stato per gestire la modale di conferma/errore
    show: false,
    title: "",
    message: "",
  });

  // Array di orari disponibili
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

  // Effetto per caricare i parrucchieri e il token CSRF al montaggio del componente
  useEffect(() => {
    fetchBarbers(); // Chiamata alla funzione per caricare i parrucchieri
    fetchCSRFToken(); // Chiamata alla funzione per caricare il token CSRF
  }, []);

  // Funzione asincrona per recuperare i parrucchieri dal server
  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers"); // Richiesta GET per ottenere i parrucchieri
      const data = await response.json(); // Estrae i dati JSON dalla risposta
      setBarbers(data); // Imposta i parrucchieri nello stato
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message); // Gestione degli errori
    }
  };

  // Funzione asincrona per recuperare il token CSRF dal server
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token", {
        credentials: "include", // Specifica che include le credenziali nella richiesta
      });
      const data = await response.json(); // Estrae i dati JSON dalla risposta
      setCsrfToken(data.csrfToken); // Imposta il token CSRF nello stato
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error.message); // Gestione degli errori
    }
  };

  // Funzione per gestire la sottomissione del form di prenotazione
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previeni il comportamento predefinito del form

    // Verifica se l'ora selezionata è già prenotata
    if (isTimeAlreadyBooked(date, time)) {
      setModal({
        show: true,
        title: "Errore",
        message:
          "Questa ora è già stata prenotata. Per favore, seleziona un'altra ora.",
      });
      return;
    }

    // Creazione di un nuovo appuntamento
    const newAppointment = {
      user_id: 1, // ID utente fisso (per esempio)
      barber_id: selectedBarber.id, // ID del parrucchiere selezionato
      name: selectedBarber.name, // Nome del parrucchiere selezionato
      date, // Data dell'appuntamento
      time, // Ora dell'appuntamento
    };

    try {
      const response = await fetch("http://localhost:8000/appointments", {
        method: "POST", // Metodo della richiesta HTTP
        headers: {
          "Content-Type": "application/json", // Tipo di contenuto della richiesta
          "X-CSRF-TOKEN": csrfToken, // Intestazione per il token CSRF
        },
        body: JSON.stringify(newAppointment), // Corpo della richiesta (dati in formato JSON)
        credentials: "include", // Include le credenziali nella richiesta
      });

      if (!response.ok) {
        throw new Error("Errore nella prenotazione dell'appuntamento"); // Gestione degli errori se la risposta non è OK
      }

      const result = await response.json(); // Estrae i dati JSON dalla risposta
      console.log("Appuntamento creato con successo:", result); // Log di conferma

      // Reset degli stati dopo la creazione dell'appuntamento
      setSelectedBarber(null);
      setDate("");
      setTime("");

      // Visualizzazione di un messaggio di successo nella modale
      setModal({
        show: true,
        title: "Successo",
        message: "Appuntamento creato con successo.",
      });

      navigate("/AppointmentList"); // Naviga alla pagina delle prenotazioni dopo la creazione
    } catch (error) {
      console.error("Errore durante la prenotazione:", error.message); // Gestione degli errori

      // Visualizzazione di un messaggio di errore nella modale
      setModal({
        show: true,
        title: "Errore",
        message: "Errore durante la prenotazione dell'appuntamento.",
      });
    }
  };

  // Funzione placeholder per verificare se un'ora è già prenotata
  const isTimeAlreadyBooked = (selectedDate, selectedTime) => {
    return false; // Placeholder per la verifica se l'ora è già prenotata
  };

  // Genera i giorni del mese specificato
  const generateDaysOfMonth = (month, year) => {
    const currentDate = new Date();
    const date = new Date(year, month, 1);
    const days = [];

    // Ciclo fino alla fine del mese specificato
    while (date.getMonth() === month) {
      const day = date.getDay();
      if (day >= 2 && day <= 6 && date >= currentDate) {
        // Filtra i giorni lavorativi futuri
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
      date.setDate(date.getDate() + 1); // Incrementa la data di un giorno
    }

    return days; // Ritorna l'array dei giorni del mese
  };

  // Funzione per gestire il cambio del mese
  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    // Logica per il cambio dell'anno
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth); // Imposta il nuovo mese corrente
    setCurrentYear(newYear); // Imposta il nuovo anno corrente
  };

  // Funzione per gestire il click su un giorno
  const handleDayClick = (selectedDate) => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay.toISOString().split("T")[0]); // Imposta la nuova data selezionata
  };

  // Genera i giorni del mese corrente
  const daysOfMonth = generateDaysOfMonth(currentMonth, currentYear);

  return (
    <>
      <div className="appo-form">
        <div className="container">
          <h2
            className="text-white mt-5 mb-5 text-center fs-1"
            style={{ fontWeight: "bold" }}
          >
            Prenota un Appuntamento
          </h2>

          {/* Form per la selezione del parrucchiere e la data dell'appuntamento */}
          {selectedBarber && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="barberName"
                  className="form-label fs-4 text-white mb-3"
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
                  className="form-label fs-4 text-white mb-3 mt-2"
                >
                  Data Dell'Appuntamento
                </label>
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-secondary me-2 shadow-button"
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
                <div className="d-flex flex-wrap appo-form-date">
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

              {/* Selezione dell'ora dell'appuntamento */}
              <div className="mb-3">
                <label
                  htmlFor="timeInput"
                  className="form-label fs-4 text-white mb-3"
                >
                  Ora Dell'Appuntamento
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

              {/* Pulsante per inviare il form di prenotazione */}
              <div className="button-form">
                <button
                  type="submit"
                  className="btn btn-primary shadow-button mt-3 mb-3 px-3"
                >
                  PRENOTA ORA
                </button>
              </div>
            </form>
          )}

          {/* Visualizzazione dei parrucchieri disponibili */}
          <div className="mt-4">
            <div className="row row-cols-1 row-cols-xl-3 row-cols-md-2 g-4 mb-5  ">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  className="col mb-5"
                  style={{ display: "flex" }}
                >
                  <div className="card h-100 g-card-a box-shadow-2 mx-2 ">
                    <img
                      src={`http://localhost:8000${barber.photo}`}
                      className="card-img-top-a"
                      alt={barber.name}
                    />
                    <div className="card-body-a bg-color d-flex">
                      <h5 className="card-title text-center">{barber.name}</h5>
                      <p className="card-text text-dark text-center">
                        {barber.description}
                      </p>
                    </div>

                    {/* Pulsante per selezionare il parrucchiere */}
                    <div className="card-actions-c bg-secondary">
                      <button
                        className="btn btn-primary shadow-button px-5"
                        onClick={() => setSelectedBarber(barber)}
                      >
                        SCEGLI
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modale per mostrare i messaggi di conferma/errore */}
          <AppointmentFormModal
            show={modal.show}
            handleClose={() => setModal({ ...modal, show: false })}
            title={modal.title}
            message={modal.message}
          />
        </div>
      </div>
      <Footer /> {/* Componente Footer per il footer della pagina */}
    </>
  );
};

export default AppointmentForm; // Esporta il componente AppointmentForm
