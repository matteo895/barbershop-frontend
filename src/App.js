// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import UserProfile from "./components/UserProfile";
import AppointmentForm from "./components/AppointmentForm";
import BarberList from "./components/BarberList";
import BarberForm from "./components/BarberForm";
import AppointmentList from "./components/AppointmentList";
import Navbar from "./components/Navbar";
import BackOffice from "./components/BackOffice";
import Login from "./components/Login"; // Importa il componente di login
import Register from "./components/Register"; // Importa il componente di registrazione

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/AppointmentForm" element={<AppointmentForm />} />
          <Route path="/BarberList" element={<BarberList />} />
          <Route path="/BarberForm" element={<BarberForm />} />
          <Route path="/BackOffice/*" element={<BackOffice />} />
          <Route path="/AppointmentList" element={<AppointmentList />} />
          <Route path="/login" element={<Login />} />{" "}
          {/* Aggiungi la rotta per il login */}
          <Route path="/register" element={<Register />} />{" "}
          {/* Aggiungi la rotta per la registrazione */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
