export const isTimeAlreadyBooked = (
  appointments,
  selectedDate,
  selectedTime
) => {
  // Verifica se l'orario è già prenotato
  const existingAppointment = appointments.find(
    (appointment) =>
      appointment.date === selectedDate && appointment.time === selectedTime
  );

  // Restituisce true se l'orario è già stato prenotato, altrimenti false
  return existingAppointment ? true : false;
};
