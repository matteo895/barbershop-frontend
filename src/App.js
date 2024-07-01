import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import AppointmentForm from "./components/AppointmentForm";
import BarberList from "./components/BarberList";
import BarberForm from "./components/BarberForm";
import AppointmentList from "./components/AppointmentList";
import Navbar from "./components/Navbar";
import BackOffice from "./components/BackOffice";
import Login from "./components/Login";
import Register from "./components/Register";
import BarberAppointment from "./components/BarberAppointment"; // Importato il componente BarberAppointment

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUser(user);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
    setLogoutSuccess(true);
    setTimeout(() => {
      setLogoutSuccess(false);
    }, 3000);
    window.location.href = "/login";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="App"
        style={{
          backgroundImage: "url('/images/barber40.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loggedInUser ? (
          <>
            <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
            <div className="content">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route
                  path="/backoffice/*"
                  element={
                    loggedInUser && loggedInUser.role === "admin" ? (
                      <BackOffice />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route path="/appointmentform" element={<AppointmentForm />} />
                <Route path="/barberlist" element={<BarberList />} />
                <Route path="/barberform" element={<BarberForm />} />
                <Route path="/appointmentlist" element={<AppointmentList />} />

                {/* Rotta dinamica per le prenotazioni di un barbiere */}
                <Route
                  path="/barbers/:barberId/appointments"
                  element={<BarberAppointment />}
                />

                {/* Reindirizzamento dinamico per il barbiere attualmente loggato */}
                <Route
                  path="/barberappointment"
                  element={
                    <Navigate
                      to={`/barbers/${loggedInUser?.barberId}/appointments`}
                    />
                  }
                />
              </Routes>
            </div>
          </>
        ) : (
          <div className="content" style={{ flex: "1" }}>
            <Routes>
              <Route
                path="/login"
                element={
                  <Login onLogin={handleLogin} logoutSuccess={logoutSuccess} />
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
