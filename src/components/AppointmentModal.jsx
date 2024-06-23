import React from "react";
import { Modal, Button } from "react-bootstrap";

const AppointmentModal = ({ show, handleClose, handleConfirm, message }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Conferma Cancellazione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annulla
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Conferma
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentModal;
