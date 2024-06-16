import React from 'react';

interface AppointmentSpecialtySelectProps {
  setAppointmentSpecialty: (selectedAppointmentSpecialty: string) => void;
  appointmentSpecialty: string | undefined;
}

const AppointmentSpecialtySelect: React.FC<AppointmentSpecialtySelectProps> = ({
  setAppointmentSpecialty,
  appointmentSpecialty,
}) => {
  const handleAppointmentSpecialtyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedAppointmentSpecialty = event.target.value;
    setAppointmentSpecialty(selectedAppointmentSpecialty);
  };

  return (
    <select
      value={appointmentSpecialty}
      name="appointment_specialty"
      id="appointment_specialty"
      onChange={handleAppointmentSpecialtyChange}
      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
    >
      <option value="">Select Specialty:</option>
      <option value="Addiction Medicine">Addiction Medicine</option>
      <option value="Behavioral Health">Behavioral Health</option>
      <option value="Primary Care">Primary Care</option>
      <option value="Urgent Care">Urgent Care</option>
      <option value="Wound Care">Wound Care</option>
      <option value="IV Treatment">IV Treatment</option>
      <option value="Metabolic">Metabolic</option>
      <option value="HRT">HRT</option>
      <option value="Aesthetics">Aesthetics</option>
      <option value="Other">Other</option>
    </select>
  );
};

export default AppointmentSpecialtySelect;
