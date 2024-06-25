import React, { useState, useEffect } from "react";

const UserProfile = () => {
  // Stato locale per memorizzare le informazioni dell'utente
  const [user, setUser] = useState(null);

  // Effetto che viene eseguito una sola volta al caricamento del componente
  useEffect(() => {
    // Funzione asincrona per recuperare il profilo dell'utente
    const fetchUserProfile = async () => {
      try {
        // Chiamata API per ottenere i dati del profilo utente
        const response = await fetch("/UserProfile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Se la risposta è OK (codice 200), ottieni i dati dell'utente
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Aggiorna lo stato locale con i dati dell'utente
        } else {
          // Gestisci la risposta di errore (gestione personalizzata)
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        // Gestisci gli errori di rete o altri errori durante la richiesta
        console.error("Failed to fetch user profile", error);
      }
    };

    // Chiamata alla funzione per recuperare il profilo dell'utente
    fetchUserProfile();
  }, []); // Array vuoto come dipendenza per eseguire l'effetto solo al mount del componente

  // Funzione per gestire l'aggiornamento del profilo utente
  const handleUpdateProfile = async (updatedProfile) => {
    try {
      // Chiamata API per aggiornare il profilo utente tramite PATCH
      const response = await fetch("/UserProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile), // Corpo della richiesta con i dati aggiornati
      });

      // Se la risposta è OK (codice 200), logga il successo
      if (response.ok) {
        console.log("Profile updated successfully");
        // Opzionalmente, aggiorna lo stato locale o esegui altre azioni al successo
      } else {
        // Gestisci la risposta di errore (gestione personalizzata)
        console.error("Failed to update user profile");
      }
    } catch (error) {
      // Gestisci gli errori di rete o altri errori durante la richiesta di aggiornamento
      console.error("Failed to update user profile", error);
    }
  };

  // Se lo stato dell'utente è null, mostra un messaggio di caricamento
  if (!user) {
    return <div>Loading...</div>;
  }

  // Quando i dati dell'utente sono disponibili, mostra il profilo utente e un pulsante per l'aggiornamento
  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => handleUpdateProfile({ name: "Updated Name" })}>
        Update Profile
      </button>
    </div>
  );
};

export default UserProfile;
