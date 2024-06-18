import React from "react";

const AppointmentForm = () => {
  return (
    <div className="container">
      <h2>Prenota un Appuntamento</h2>
      {/* Form per la prenotazione */}
      <form>
        <div className="mb-3">
          <label htmlFor="barberSelect" className="form-label">
            Seleziona il Parrucchiere
          </label>
          <select className="form-select" id="barberSelect">
            {/* Opzioni per i parrucchieri */}
            <option>Francesco</option>
            <option>Matteo</option>
            <option>Michele</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="dateInput" className="form-label">
            Data dell'Appuntamento
          </label>
          <input type="date" className="form-control" id="dateInput" />
        </div>
        <div className="mb-3">
          <label htmlFor="timeInput" className="form-label">
            Ora dell'Appuntamento
          </label>
          <input type="time" className="form-control" id="timeInput" />
        </div>
        <button type="submit" className="btn btn-primary">
          Prenota
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
