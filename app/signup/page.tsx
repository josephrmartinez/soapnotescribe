import React from 'react';
import Logo from '../ui/logo';
import { signup } from './action';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-24">
      <div className="w-[300px] rounded-md bg-gray-50 p-6 ">
        <div className="mb-6 mt-2 flex justify-center">
          <Logo />
        </div>

        <form className="flex flex-col gap-2">
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" required />
          <Label htmlFor="password">Password:</Label>
          <Input id="password" name="password" type="password" required />
          <Separator />
          <Button formAction={signup}>Sign up</Button>
        </form>
        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-500">Already have an account?</p>
          <Link href="/login" className="my-1  underline underline-offset-4">
            log in
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      className="rounded bg-teal-600 px-4 py-2 font-semibold text-white transition duration-100 ease-in-out hover:bg-teal-500"
      {...rest}
    >
      {children}
    </button>
  );
};
const Input: React.FC<InputProps> = ({ ...rest }) => {
  return (
    <input
      className="rounded border border-gray-200  bg-white px-4 py-2 outline-none focus:bg-white focus:text-black"
      {...rest}
    />
  );
};

const Label: React.FC<LabelProps> = ({ children, ...rest }) => {
  return (
    <label {...rest} className="text-sm ">
      {children}
    </label>
  );
};

const Separator = () => <hr className="my-2 border-white/10" />;
