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
      className={`rounded  px-4 py-2 font-semibold text-white transition duration-100 ease-in-out ${pending ? 'bg-teal-500' : active ? 'bg-teal-600 hover:bg-teal-500' : 'bg-gray-400'} `}
      {...rest}
    >
      {pending ? <div>Loading...</div> : children}
    </button>
  );
};

export { SubmitButton };

// Issue with this component is passing the formAction event handler. Current approach is based on React docs: https://react.dev/reference/react/useTransition#preventing-unwanted-loading-indicators But in this case I am declaring an onClick event in the parent component. Ultimately, I want to not use onClick but use a formAction so that I automatically pass back the formData values to the server action.

// 'use client';

// import React, { ReactNode } from 'react';
// import { useTransition } from 'react';

// interface SubmitButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: ReactNode;
//   isActive: boolean;
// }

// const SubmitButton: React.FC<SubmitButtonProps> = ({
//   children,
//   isActive,
//   onClick,
// }) => {
//   const [isPending, startTransition] = useTransition();

//   if (isActive) {
//     return <b>{children}</b>;
//   }
//   if (isPending) {
//     return <b className="bg-teal-500">{children}</b>;
//   }
//   return (
//     <button
//       onClick={() => {
//         startTransition(() => {
//           onClick();
//         });
//       }}
//     >
//       {children}
//     </button>
//   );
// };

// export { SubmitButton };
