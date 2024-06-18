// Importazioni necessarie per il componente
import React, { useState, useEffect } from "react";
import BarberForm from "./BarberForm";
import BarberList from "./BarberList";

const BackOffice = () => {
  // Stato per memorizzare i parrucchieri, il parrucchiere in fase di modifica e il token CSRF
  const [barbers, setBarbers] = useState([]);
  const [editingBarber, setEditingBarber] = useState(null);
  const [csrfToken, setCSRFToken] = useState("");

  // Effettua il fetch dei parrucchieri e del token CSRF al montaggio del componente
  useEffect(() => {
    fetchBarbers();
    fetchCSRFToken();
  }, []);

  // Funzione per recuperare la lista dei parrucchieri
  const fetchBarbers = async () => {
    try {
      const response = await fetch("http://localhost:8000/barbers");
      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      console.error("Errore nel recupero dei parrucchieri:", error);
    }
  };

  // Funzione per recuperare il token CSRF
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/csrf-token");
      const data = await response.json();
      setCSRFToken(data.csrfToken);
    } catch (error) {
      console.error("Errore nel recupero del token CSRF:", error);
    }
  };

  // Funzione per aggiungere un nuovo parrucchiere
  const handleAddBarber = async (barber) => {
    try {
      const response = await fetch("http://localhost:8000/barbers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(barber),
      });
      if (!response.ok)
        throw new Error("Errore nella creazione del parrucchiere");
      const newBarber = await response.json();
      setBarbers([...barbers, newBarber]);
    } catch (error) {
      console.error("Errore durante la creazione del parrucchiere:", error);
    }
  };

  // Funzione per aggiornare un parrucchiere esistente
  const handleUpdateBarber = async (barber) => {
    try {
      const response = await fetch(
        `http://localhost:8000/barbers/${barber.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify(barber),
        }
      );
      if (!response.ok)
        throw new Error("Errore nell'aggiornamento del parrucchiere");
      const updatedBarber = await response.json();
      setBarbers(
        barbers.map((b) => (b.id === updatedBarber.id ? updatedBarber : b))
      );
    } catch (error) {
      console.error("Errore durante l'aggiornamento del parrucchiere:", error);
    }
  };

  // Funzione per eliminare un parrucchiere
  const handleDeleteBarber = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/barbers/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });
      if (!response.ok)
        throw new Error("Errore nella cancellazione del parrucchiere");
      setBarbers(barbers.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Errore durante la cancellazione del parrucchiere:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Back Office</h2>
      <BarberForm
        onSubmit={editingBarber ? handleUpdateBarber : handleAddBarber}
        editingBarber={editingBarber}
      />
      <BarberList
        barbers={barbers}
        onEdit={setEditingBarber}
        onDelete={handleDeleteBarber}
      />
    </div>
  );
};

export default BackOffice;
