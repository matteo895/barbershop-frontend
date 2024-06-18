import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="banner bg-dark text-light py-5">
        <div className="container">
          <h2>Benvenuto nel Barbershop</h2>
          <p>Prenota il tuo taglio di capelli oggi stesso!</p>
          <Link to="/AppointmentForm" className="btn btn-primary">
            Prenota Ora
          </Link>
        </div>
      </div>
      <div className="info-section py-5">
        <div className="container">
          {/* Informazioni sul Barbershop */}
          <div className="barbershop-info">
            <h3>Il Nostro Barbershop</h3>
            <p>
              Il Barbershop offre una vasta gamma di servizi di taglio di
              capelli e barba.
            </p>
            <p>Vieni a trovarci e scopri il nostro stile unico!</p>
            {/* Altre informazioni sul barbershop */}
          </div>
          {/* Galleria di Immagini */}
          <div className="gallery">{/* Immagini di tagli di capelli */}</div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
