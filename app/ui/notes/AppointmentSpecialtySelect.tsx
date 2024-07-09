import React from 'react';

interface AppointmentSpecialtySelectProps {
  setAppointmentSpecialty: (selectedAppointmentSpecialty: string) => void;
  appointmentSpecialty: string | undefined;
  appointmentSpecialties: string[];
}

const AppointmentSpecialtySelect: React.FC<AppointmentSpecialtySelectProps> = ({
  setAppointmentSpecialty,
  appointmentSpecialty,
  appointmentSpecialties,
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
      {appointmentSpecialties.map((appointmentSpecialtyName) => (
        <option value={appointmentSpecialtyName} key={appointmentSpecialtyName}>
          {appointmentSpecialtyName}
        </option>
      ))}
      <option value="Other">Other</option>
    </select>
  );
};

export default AppointmentSpecialtySelect;
