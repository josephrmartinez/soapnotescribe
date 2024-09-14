'use client';

import clsx from 'clsx';
import { useFormStatus } from 'react-dom';

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
