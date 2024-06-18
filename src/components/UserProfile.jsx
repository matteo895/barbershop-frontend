import React from "react";

const UserProfile = () => {
  return (
    <div className="container">
      <h2>Profilo Utente</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Informazioni Utente</h5>
          <p className="card-text">Nome: John Doe</p>
          <p className="card-text">Email: john@example.com</p>
          <button className="btn btn-primary">Modifica Profilo</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
