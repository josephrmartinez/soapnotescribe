'use client';

import React, { useState } from 'react';
import Logo from '../ui/logo';
import { signup } from './action';
import Link from 'next/link';
import { SubmitFormButton } from '../ui/buttons/SubmitFormButton';

export default function SignUpPage() {
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const submitOkay = password.length > 6 && password === passwordConfirm;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-24">
      <div className="w-[300px] rounded-md bg-gray-50 p-6 ">
        <div className="mb-6 mt-2 flex justify-center">
          <Logo />
        </div>

        <form className="flex flex-col gap-2">
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" required />
          <Label htmlFor="password">Create Password:</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={7}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label htmlFor="password">Confirm Password:</Label>
          <Input
            id="password_confirm"
            name="password_confirm"
            type="password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <Separator />
          <SubmitFormButton formAction={signup} active={submitOkay}>
            Sign up
          </SubmitFormButton>
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

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Button: React.FC<ButtonProps> = ({ children, active, ...rest }) => {
  return (
    <button
      disabled={!active}
      className={`rounded  px-4 py-2 font-semibold text-white transition duration-100 ease-in-out ${active ? 'bg-teal-600 hover:bg-teal-500' : 'bg-gray-400'} `}
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
