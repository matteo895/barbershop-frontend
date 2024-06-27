import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Effettua la chiamata al backend Laravel per il login
      const response = await fetch("http://localhost:8000/login");

      if (response.ok) {
        // Se il login è avvenuto con successo, reindirizza all'endpoint del backend Laravel per l'autenticazione
        window.location.href = "http://localhost:8000/login";
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              <button onClick={handleLogin} className="btn btn-primary">
                Login with Laravel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
