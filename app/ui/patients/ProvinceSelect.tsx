import React, { useState } from 'react';

interface ProvinceSelectProps {
  setProvince: (selectedProvince: string) => void;
  province: string | undefined;
}

const ProvinceSelect: React.FC<ProvinceSelectProps> = ({
  setProvince,
  province,
}) => {
  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedProvince = event.target.value;
    setProvince(selectedProvince);
  };

  return (
    <select
      value={province}
      name="province"
      onChange={handleProvinceChange}
      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
    >
      <option value="">Select</option>
      <option value="Alberta">Alberta</option>
      <option value="British Columbia">British Columbia</option>
      <option value="Manitoba">Manitoba</option>
      <option value="New Brunswick">New Brunswick</option>
      <option value="Newfoundland and Labrador">
        Newfoundland and Labrador
      </option>
      <option value="Nova Scotia">Nova Scotia</option>
      <option value="Ontario">Ontario</option>
      <option value="Prince Edward Island">Prince Edward Island</option>
      <option value="Quebec">Quebec</option>
      <option value="Saskatchewan">Saskatchewan</option>
      <option value="Northwest Territories">Northwest Territories</option>
      <option value="Nunavut">Nunavut</option>
      <option value="Yukon">Yukon</option>
    </select>
  );
};

export default ProvinceSelect;
