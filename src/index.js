import React from "react";
import ReactDOM from "react-dom/client"; // Import from "react-dom/client"
import App from "./App";
import { AppProvider } from "./AppContext"; // Importa il provider del contesto
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      {" "}
      {/* Avvolgi la tua App con il provider del contesto */}
      <App />
    </AppProvider>
  </React.StrictMode>
);
