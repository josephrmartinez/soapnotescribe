import React from 'react';

import AsyncSelect from 'react-select/async';

const patients = [
  { value: { first_name: 'Kevin', last_name: 'Smith' }, label: 'Kevin Smith' },
  { value: { first_name: 'Brice', last_name: 'Lopez' }, label: 'Brice Lopez' },
  { value: { first_name: 'Kim', last_name: 'Basha' }, label: 'Kim Basha' },
];

const filterPatients = (inputValue: string) => {
  return patients.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
};

interface PatientOption {
  value: { first_name: string; last_name: string };
  label: string;
}

const promiseOptions = (inputValue: string) =>
  new Promise<PatientOption[]>((resolve) => {
    setTimeout(() => {
      resolve(filterPatients(inputValue));
    }, 1000);
  });

export default () => (
  <AsyncSelect
    cacheOptions
    defaultOptions
    placeholder="Select patient..."
    noOptionsMessage={({ inputValue }) =>
      "Patient not found. Select 'add new patient' below."
    }
    loadOptions={promiseOptions}
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
