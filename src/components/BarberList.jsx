import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importa il componente Link da react-router-dom per la navigazione
import Footer from "./Footer"; // Importa il componente Footer

const BarberList = () => {
  // Definisce lo stato del componente
  const [barbers, setBarbers] = useState([]); // Stato per memorizzare la lista dei parrucchieri

  // Effetto per ottenere la lista dei parrucchieri quando il componente viene montato
  useEffect(() => {
    fetchBarbers(); // Chiama la funzione per ottenere la lista dei parrucchieri
  }, []);

  // Funzione per ottenere la lista dei parrucchieri dal server
  const fetchBarbers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/barbers`); // Effettua una richiesta GET al server
      if (!response.ok) {
        throw new Error("Errore nel recupero dei barbieri"); // Lancia un errore se la risposta non è OK
      }
      const data = await response.json(); // Estrai la lista dei parrucchieri dalla risposta
      setBarbers(data); // Imposta la lista dei parrucchieri nello stato
    } catch (error) {
      console.error("Errore nel recupero dei barbieri:", error.message); // Stampa un messaggio di errore in caso di fallimento
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
            {/* Mappa la lista dei parrucchieri e crea una card per ciascuno */}
            {barbers.map((barber) => (
              <div key={barber.id} className="col-md-4 mb-5 hair-list">
                <div className="card bg-secondary text-white mx-2 g-card-a">
                  <div className="card-body ">
                    <h5 className="card-title mb-4">{barber.name}</h5>
                    {/* Link alla pagina delle prenotazioni del parrucchiere */}
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
      <Footer /> {/* Componente Footer */}
    </>
  );
};

export default BarberList;
