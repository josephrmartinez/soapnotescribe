'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useFormStatus } from 'react-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  active?: boolean;
  secondary?: boolean;
}

export function Button({
  children,
  className,
  active = true,
  secondary = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        {
          'bg-gray-100 hover:bg-gray-200': secondary,
          'bg-teal-600 text-white shadow hover:bg-teal-500 active:bg-teal-600':
            active && !secondary,
          'cursor-not-allowed bg-gray-300 opacity-50': !active,
        },
        className,
      )}
      disabled={!active}
    >
      {children}
    </button>
  );
}

interface SubmitFormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  active?: boolean;
  secondary?: boolean;
  formAction: (formData: FormData) => Promise<void>;
}

export const SubmitFormButton: React.FC<SubmitFormButtonProps> = ({
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

interface LoginButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  active,
  className,
  ...rest
}) => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={!active || pending}
      className={clsx(
        'flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        {
          'bg-teal-600 text-white shadow hover:bg-teal-500 active:bg-teal-600':
            active,
          'cursor-not-allowed bg-gray-300 opacity-50': !active,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export const CancelGoBackButton = () => {
  return (
    <Link
      href="."
      className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
    >
      Cancel
    </Link>
  );
};

export const PlusLinkButton = ({
  href,
  text,
}: {
  href: string;
  text: string;
}) => {
  return (
    <Link
      href={href}
      className="inline-flex h-10  items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600"
    >
      <PlusIcon width={22} className="mr-2" />
      {text}
    </Link>
  );
};
