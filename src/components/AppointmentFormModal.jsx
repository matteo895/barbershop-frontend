import React from "react";
import { Modal, Button } from "react-bootstrap";

const AppointmentFormModal = ({ show, handleClose, title, message }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      {/* Header del Modale */}
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      {/* Corpo del Modale */}
      <Modal.Body>{message}</Modal.Body>

      {/* Footer del Modale */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          CHIUDI
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentFormModal;
