import clsx from 'clsx';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  active?: boolean;
}

export function FileInput({ active = true, className, ...inputProps }: FileInputProps) {
  return (
    <div className="flex items-center gap-4">
      <input
        {...inputProps}
        type="file"
        className={clsx(
          'cursor-pointer text-sm border-gray-300 bg-gray-100 text-gray-600 focus:ring-2',
          'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
          {
            'bg-teal-600 text-white hover:bg-teal-500 active:bg-teal-600': active,
            'bg-gray-300 cursor-not-allowed opacity-50': !active,
          },
          className
        )}
        disabled={!active}
      />
    </div>
  );
}