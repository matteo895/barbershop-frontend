import React from "react";

const AppointmentList = () => {
  return (
    <div className="container">
      <h2>Elenco Prenotazioni</h2>
      {/* Lista delle prenotazioni */}
      <div className="list-group">
        {/* Elementi della lista delle prenotazioni */}
        <a href="#" className="list-group-item list-group-item-action">
          12 Luglio - Francesco - 10:00 AM
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          15 Luglio - Matteo - 11:30 AM
        </a>
        {/* Aggiungi altre prenotazioni */}
      </div>
    </div>
  );
};

export default AppointmentList;
