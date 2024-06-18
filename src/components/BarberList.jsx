// BarberList.jsx

import React from "react";

const BarberList = ({ barbers, onEdit, onDelete }) => {
  return (
    <div>
      <h3>Lista dei Parrucchieri</h3>
      <div className="row">
        {barbers.map((barber) => (
          <div className="col-md-4 mb-3" key={barber.id}>
            <div className="card">
              <img
                src={barber.photo}
                className="card-img-top"
                alt={barber.name}
              />
              <div className="card-body">
                <h5 className="card-title">{barber.name}</h5>
                <p className="card-text">{barber.description}</p>
                <button
                  className="btn btn-warning mr-2"
                  onClick={() => onEdit(barber)}
                >
                  Modifica
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(barber.id)}
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberList;
