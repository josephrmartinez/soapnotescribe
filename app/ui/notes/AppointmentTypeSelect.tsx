import React from 'react';

interface AppointmentTypeSelectProps {
  setAppointmentType: (selectedAppointmentType: string) => void;
  appointmentType: string | undefined;
}

const AppointmentTypeSelect: React.FC<AppointmentTypeSelectProps> = ({
  setAppointmentType,
  appointmentType,
}) => {
  const handleAppointmentTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedAppointmentType = event.target.value;
    setAppointmentType(selectedAppointmentType);
  };

  return (
    <select
      value={appointmentType}
      id="appointment_type"
      name="appointment_type"
      onChange={handleAppointmentTypeChange}
      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
    >
      <option value="">Select Type:</option>
      <option value="Telemedicine">Telemedicine</option>
      <option value="In Person">In Person</option>
    </select>
  );
};

export default AppointmentTypeSelect;
