// Logout.js

import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/logout", {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    logout();
  }, []);

  return <Redirect to="/" />;
};

export default Logout;
