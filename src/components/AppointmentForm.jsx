import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentFormModal from "./AppointmentFormModal";
import Footer from "./Footer";

const AppointmentForm = () => {
  const navigate = useNavigate();

  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
  });

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

  useEffect(() => {
    fetchBarbers();
    fetchCSRFToken();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      user_id: 1,
      barber_id: selectedBarber.id,
      name: selectedBarber.name,
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

      setSelectedBarber(null);
      setDate("");
      setTime("");

      setModal({
        show: true,
        title: "Successo",
        message: "Appuntamento creato con successo.",
      });

      navigate("/AppointmentList"); // Naviga alla pagina delle prenotazioni dopo la creazione
    } catch (error) {
      console.error("Errore durante la prenotazione:", error.message);

      setModal({
        show: true,
        title: "Errore",
        message: "Errore durante la prenotazione dell'appuntamento.",
      });
    }
  };

  const isTimeAlreadyBooked = (selectedDate, selectedTime) => {
    return false; // Placeholder per la verifica se l'ora è già prenotata
  };

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

  const handleDayClick = (selectedDate) => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay.toISOString().split("T")[0]);
  };

  const daysOfMonth = generateDaysOfMonth(currentMonth, currentYear);

  return (
    <>
      <div className="appo-form">
        <div className="container">
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

              <div className="mb-3">
                <label
                  htmlFor="timeInput"
                  className="form-label fs-5 text-white mb-3"
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

          <div className="mt-4">
            <div className="row">
              {barbers.map((barber) => (
                <div className="col-md-4 g-appo-form" key={barber.id}>
                  <div className="card mb-5 mt-2 g-form box-shadow-2 mx-1">
                    <img
                      src={barber.photo}
                      className="card-img-top"
                      alt={barber.name}
                    />
                    <div className="card-body bg-color">
                      <h5 className="card-title text-black text-center">
                        {barber.name}
                      </h5>
                      <p className="card-text text-dark text-center">
                        {barber.description}
                      </p>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-primary shadow-button"
                          onClick={() => setSelectedBarber(barber)}
                        >
                          SCEGLI : {barber.name}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AppointmentFormModal
            show={modal.show}
            handleClose={() => setModal({ ...modal, show: false })}
            title={modal.title}
            message={modal.message}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentForm;
