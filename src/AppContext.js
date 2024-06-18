// AppContext.js

import React, { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Altri stati e funzioni di gestione dello stato

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        barbers,
        setBarbers,
        appointments,
        setAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
