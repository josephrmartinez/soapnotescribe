'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface AddPatientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  active?: boolean;
  secondary?: boolean;
  formAction: (formData: FormData) => Promise<void>;
}

export const AddPatientButton: React.FC<AddPatientButtonProps> = ({
  children,
  className,
  active,
  secondary = false,
  formAction,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) {
      console.error('Button is not inside a form');
      return;
    }

    const formData = new FormData(form);
    setIsLoading(true);
    try {
      await formAction(formData);
    } catch (error) {
      console.error('Error during form action:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="submit" // Ensure the button is of type submit
      disabled={!active || isLoading}
      className={clsx(
        'flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        {
          'bg-gray-100 text-gray-600 hover:bg-gray-200': secondary,
          'bg-teal-600 text-white shadow hover:bg-teal-500 active:bg-teal-600':
            active && !secondary,
          'cursor-not-allowed bg-gray-300 opacity-50': !active,
        },
        className,
      )}
      onClick={handleClick}
      {...rest}
    >
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className={`${secondary ? 'loader-gray' : 'loader-white'} mx-auto h-5`}
          ></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
