'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

const SubmitButton: React.FC<ButtonProps> = ({ children, active, ...rest }) => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={!active || pending}
      className={`rounded-lg px-4  py-2 text-sm transition duration-100 ease-in-out ${pending ? 'bg-teal-500' : active ? 'bg-teal-600 hover:bg-teal-500' : 'bg-gray-300'} `}
      {...rest}
    >
      {pending ? <div>Loading...</div> : children}
    </button>
  );
};

export { SubmitButton };
