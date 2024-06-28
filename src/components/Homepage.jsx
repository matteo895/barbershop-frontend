import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Assicurati di aver installato Bootstrap

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="banner  py-5">
        <div className="container text-center text-white">
          <h2 className="text-b">Benvenuto nel Barbershop</h2>
          <p className="lead-p">
            Prenota il tuo taglio di capelli oggi stesso!
          </p>
          <Link
            to="/AppointmentForm"
            className="btn btn-primary btn-lg box-shadow-button"
          >
            PRENOTA ORA
          </Link>
        </div>
      </div>

      <div className="info-section">
        <video autoPlay loop className="background-video">
          <source src="/public/images/barbervideo.mp4" type="video/mp4" />
          il tuo browser non supporta questo formato video
        </video>
        <video src="/images/barbervideo.mp4">
          <div className="overlay"></div>
          <div className="container-central">
            <h3 className="display-5 mb-4 ">Il Nostro Barbershop</h3>
            <p className="lead-p">
              Il Barbershop offre una vasta gamma di servizi di taglio di
              capelli e barba. Vieni a trovarci e scopri il nostro stile unico!
            </p>
          </div>
        </video>
      </div>

      <div className="container section-2 py-5">
        <h3 className="text-style  mb-4 text-center text-white">Hair Style</h3>
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card-c mb-4 box-shadow">
              <div className="photo">
                <Link to="/AppointmentForm">
                  <img
                    src="/images/barbershop17.jpg"
                    className="card-img-top"
                    alt="Stile 1"
                  />
                </Link>
              </div>
              <div className="card-body">
                <h5 className="card-title text-center text-dark">
                  STILE CLASSICO
                </h5>
                <p className="card-text text-center text-dark">
                  Un look intramontabile per ogni occasione.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-c  mb-4 box-shadow">
              <div className="photo">
                <Link to="/AppointmentForm">
                  <img
                    src="/images/barbershop16.jpg"
                    className="card-img-top"
                    alt="Stile 2"
                  />
                </Link>
              </div>
              <div className="card-body">
                <h5 className="card-title text-center text-dark">
                  STILE MODERNO
                </h5>
                <p className="card-text text-center text-dark">
                  Perfetto per un look contemporaneo.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-c mb-4 box-shadow">
              <div className="photo">
                <Link to="/AppointmentForm">
                  <img
                    src="/images/barbershop18.jpg"
                    className="card-img-top"
                    alt="Stile 3"
                  />
                </Link>
              </div>
              <div className="card-body">
                <h5 className="card-title text-center text-dark">
                  STILE CREATIVO
                </h5>
                <p className="card-text text-center text-dark">
                  Esprimi la tua personalità con un taglio unico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-light py-3">
        <div className="container text-center">
          <p>&copy; 2024 Barbershop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
