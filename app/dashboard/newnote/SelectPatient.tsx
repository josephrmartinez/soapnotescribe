import React from 'react';
import AsyncSelect from 'react-select/async';
import { fetchPatients } from '@/app/lib/data';
import { ActionMeta, SingleValue, InputActionMeta } from 'react-select';
import { type PatientSelect, PatientSelectOption } from '@/app/lib/definitions';

const structurePatients = (
  fetchedPatients: PatientSelect[],
): PatientSelectOption[] => {
  return fetchedPatients.map((patient) => ({
    value: patient,
    label: `${patient.last_name}, ${patient.first_name}`,
  }));
};

const filterPatients = (
  inputValue: string,
  patients: PatientSelectOption[],
) => {
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
    newValue: SingleValue<PatientSelectOption>,
    actionMeta: ActionMeta<PatientSelectOption>,
  ) => void;
  selectedPatient?: PatientSelectOption;
}

const PatientSelect: React.FC<PatientSelectProps> = ({
  onPatientSelect,
  selectedPatient,
}) => (
  <AsyncSelect
    cacheOptions
    defaultOptions
    value={selectedPatient}
    placeholder="Select patient..."
    noOptionsMessage={({ inputValue }) =>
      "Patient not found. Select '+ add new patient'"
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
