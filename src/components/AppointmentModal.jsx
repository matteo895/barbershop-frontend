import React from "react";
import { Modal, Button } from "react-bootstrap"; // Importa Modal e Button dal pacchetto react-bootstrap

// Definisce il componente AppointmentModal che accetta props: show, handleClose, handleConfirm, e message
const AppointmentModal = ({ show, handleClose, handleConfirm, message }) => {
  return (
    // Utilizza il componente Modal di react-bootstrap, controllato dalla prop show e chiuso con handleClose
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>CONFERMA CANCELLAZIONE</Modal.Title>{" "}
        {/* Titolo della modale */}
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p> {/* Messaggio passato come prop */}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="shadow-button"
        >
          ANNULLA {/* Pulsante per chiudere la modale senza confermare */}
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          className="shadow-button"
        >
          CONFERMA {/* Pulsante per confermare l'azione */}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentModal; // Esporta il componente AppointmentModal
