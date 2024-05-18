import React from 'react';
import AsyncSelect from 'react-select/async';
import { fetchPatients } from '@/app/lib/data';
import { ActionMeta, SingleValue, InputActionMeta } from 'react-select';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_street: string;
  address_unit: string;
  city: string;
  state: string;
  zipcode: string;
  provider: string;
  date_of_birth: string;
  allergies: string;
  profile_notes: string;
}

interface PatientOption {
  value: Patient;
  label: string;
}

const structurePatients = (fetchedPatients: Patient[]): PatientOption[] => {
  return fetchedPatients.map((patient) => ({
    value: patient,
    label: `${patient.last_name}, ${patient.first_name}`,
  }));
};

const filterPatients = (inputValue: string, patients: PatientOption[]) => {
  return patients.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
};

const loadOptions = async (inputValue: string) => {
  try {
    const fetchedPatients = await fetchPatients();
    if (!fetchedPatients) {
      return [];
    }
    const patients = structurePatients(fetchedPatients);
    return filterPatients(inputValue, patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};

interface PatientSelectProps {
  onPatientSelect: (
    newValue: SingleValue<PatientOption>,
    actionMeta: ActionMeta<PatientOption>,
  ) => void;
}

const PatientSelect: React.FC<PatientSelectProps> = ({ onPatientSelect }) => (
  <AsyncSelect
    cacheOptions
    defaultOptions
    placeholder="Select patient..."
    noOptionsMessage={({ inputValue }) =>
      "Patient not found. Select 'add new patient' below."
    }
    loadOptions={loadOptions}
    onChange={onPatientSelect}
    styles={{
      input: (base) => ({
        ...base,
        'input:focus': {
          boxShadow: 'none',
        },
      }),
    }}
  />
);

export default PatientSelect;
