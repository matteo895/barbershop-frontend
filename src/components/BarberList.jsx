import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const BarberList = () => {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/barbers`);
      if (!response.ok) {
        throw new Error("Errore nel recupero dei barbieri");
      }
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error("Errore nel recupero dei barbieri:", error.message);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="text-center text-white">
          <h2 className="mb-5 " style={{ fontWeight: "bold" }}>
            PARRUCCHIERI ALLE ARMI :
          </h2>
          <div className="row">
            {barbers.map((barber) => (
              <div key={barber.id} className="col-md-4 mb-5 hair-list">
                <div className="card bg-secondary text-white mx-2 g-card-a">
                  <div className="card-body ">
                    <h5 className="card-title mb-4">{barber.name}</h5>
                    <Link
                      to={`/barbers/${barber.id}/appointments`}
                      className="btn btn-primary shadow-button mb-2"
                    >
                      Visualizza Prenotazioni
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BarberList;
