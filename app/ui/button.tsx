import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function Button({ children, className, active = true, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        {
          'bg-teal-600 text-white hover:bg-teal-500 active:bg-teal-600': active,
          'bg-gray-300 cursor-not-allowed opacity-50': !active,
        },
        className,
      )}
      disabled={!active}
    >
      {children}
    </button>
  );
}