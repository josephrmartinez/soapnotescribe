import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
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
        'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        {
          'bg-white, border-2 border-teal-700 text-teal-700 shadow hover:bg-gray-200':
            secondary,
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
