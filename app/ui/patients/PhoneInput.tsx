import React, { useState, ChangeEvent } from 'react';

interface PhoneInputProps {
  setPhone: (phone: string) => void;
  phone: string | null;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ phone, setPhone }) => {
  // const [phone, setPhone] = useState<string>('');

  const formatPhoneNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    const length = numericValue.length;
    if (length < 3) return numericValue;
    if (length < 6)
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Set the formatted phone number
    setPhone(formatPhoneNumber(value));
    // onChange(formatPhoneNumber(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const input = e.target as HTMLInputElement;
      const cursorPosition = input.selectionStart ?? 0;

      if (
        (cursorPosition === 4 || cursorPosition === 8) &&
        e.key === 'Backspace'
      ) {
        e.preventDefault();
        const newPhone =
          phone.slice(0, cursorPosition - 1).replace('-', '') +
          phone.slice(cursorPosition).replace('-', '');
        setPhone(formatPhoneNumber(newPhone));

        window.requestAnimationFrame(() => {
          input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        });
      }

      if (
        (cursorPosition === 3 || cursorPosition === 7) &&
        e.key === 'Delete'
      ) {
        e.preventDefault();
        const newPhone =
          phone.slice(0, cursorPosition).replace('-', '') +
          phone.slice(cursorPosition + 1).replace('-', '');
        setPhone(formatPhoneNumber(newPhone));

        window.requestAnimationFrame(() => {
          input.setSelectionRange(cursorPosition, cursorPosition);
        });
      }
    }
  };

  return (
    <input
      id="phone"
      name="phone"
      type="text"
      placeholder="123-123-1234"
      maxLength={12}
      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
      value={phone}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default PhoneInput;
