import React, { useState, useEffect } from "react";

const UserProfile = () => {
  // Stati per gestire il profilo utente e gli errori
  const [user, setUser] = useState(null); // Contiene i dati del profilo utente
  const [error, setError] = useState(null); // Contiene eventuali errori durante il recupero dei dati

  // useEffect per eseguire il fetch del profilo utente al caricamento del componente
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Esegue una richiesta GET al server per recuperare il profilo utente
        const response = await fetch("/UserProfile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Se la risposta è positiva (status code 200)
        if (response.ok) {
          // Controlla il tipo di contenuto della risposta
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            // Se il tipo di contenuto è JSON, ottiene i dati e li imposta nello stato
            const userData = await response.json();
            setUser(userData);
          } else {
            // Se il tipo di contenuto non è JSON, gestisce l'errore
            setError("Unexpected content type");
            console.error("Unexpected content type:", contentType);
          }
        } else {
          // Se la richiesta non è andata a buon fine, gestisce l'errore
          setError("Failed to fetch user profile");
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        // Se si verifica un errore durante la richiesta, gestisce l'errore
        setError("Failed to fetch user profile");
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile(); // Esegue la funzione fetchUserProfile al caricamento del componente
  }, []); // Array vuoto come dipendenza per eseguire solo al mount del componente

  // Funzione per gestire l'aggiornamento del profilo utente
  const handleUpdateProfile = async (updatedProfile) => {
    try {
      // Esegue una richiesta PATCH al server per aggiornare il profilo utente
      const response = await fetch("/UserProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile), // Invia i nuovi dati del profilo in formato JSON
      });

      // Se la risposta è positiva, logga il successo
      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        // Se la richiesta non è andata a buon fine, gestisce l'errore
        console.error("Failed to update user profile");
      }
    } catch (error) {
      // Se si verifica un errore durante la richiesta, gestisce l'errore
      console.error("Failed to update user profile", error);
    }
  };

  // Se è presente un errore, mostra un messaggio di errore
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Se user è null (ancora in caricamento), mostra "Loading..."
  if (!user) {
    return <div>Loading...</div>;
  }

  // Una volta caricato il profilo, mostra i dettagli del profilo e un pulsante per l'aggiornamento
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
