import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import UserProfile from "./components/UserProfile";
import AppointmentForm from "./components/AppointmentForm.jsx";
import BarberList from "./components/BarberList.jsx";
import BarberForm from "./components/BarberForm.jsx";
import AppointmentList from "./components/AppointmentList.jsx";
import Navbar from "./components/Navbar.jsx";
import BackOffice from "./components/BackOffice.jsx";

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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
