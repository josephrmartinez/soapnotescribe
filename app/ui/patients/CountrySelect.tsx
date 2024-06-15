import React, { useState } from 'react';

interface CountrySelectProps {
  setCountry: (selectedCountry: string) => void;
  country: string | undefined;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  setCountry,
  country,
}) => {
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
  };

  return (
    <select
      value={country}
      name="country"
      onChange={handleCountryChange}
      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
    >
      <option value="United States">United States</option>
      <option value="Canada">Canada</option>
      <option value="Other">Other</option>
    </select>
  );
};

export default CountrySelect;
