import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const EditAppointmentModal = ({
  show,
  handleClose,
  handleUpdate,
  appointment,
}) => {
  const [updatedAppointment, setUpdatedAppointment] = useState({
    id: appointment?.id || "",
    time: appointment?.time || "",
    barber: appointment?.barber || null, // Aggiungi il campo barber in updatedAppointment
  });

  const times = [
    "08:30",
    "09:30",
    "10:30",
    "11:30",
    "12:30",
    "15:30",
    "16:30",
    "17:30",
    "18:30",
    "19:30",
  ];

  useEffect(() => {
    if (appointment) {
      setUpdatedAppointment({
        id: appointment.id,
        time: appointment.time,
        barber: appointment.barber || null,
      });
    }
  }, [appointment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Invio aggiornamento appuntamento:", updatedAppointment);
    handleUpdate(updatedAppointment);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Appuntamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          In questa sezione è possibile modificare solo l'ora della
          prenotazione. Se desideri fare ulteriori modifiche, è consigliabile
          cancellare la prenotazione e rifarla nella sezione Prenota.
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="timeInput">
            <Form.Label>Ora dell'Appuntamento</Form.Label>
            <Form.Control
              as="select"
              value={updatedAppointment.time}
              onChange={(e) =>
                setUpdatedAppointment({
                  ...updatedAppointment,
                  time: e.target.value,
                })
              }
              required
            >
              <option value="">Seleziona un orario</option>
              {times.map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Salva Modifiche
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditAppointmentModal;
