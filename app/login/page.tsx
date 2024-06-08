'use client';

import React, { useState } from 'react';
import Logo from '../ui/logo';
import { login } from './action';
import Link from 'next/link';
import { SubmitButton } from '../ui/submitButton';

export default function LoginPage() {
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const submitOkay = password !== '' && email !== '';

  return (
    <div className="flex h-screen flex-col items-center justify-between bg-gray-50 p-24">
      <div className="w-[300px] rounded-md bg-gray-50 p-6">
        <div className="mb-6 mt-2 flex justify-center">
          <Logo />
        </div>

        <form action={login} className="flex flex-col gap-2">
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Separator />

          <SubmitButton active={submitOkay}>Log in</SubmitButton>
        </form>
        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-500">Don't yet have an account?</p>
          {/* <Link href="/signup" className="my-1  underline underline-offset-4">
            sign up for free
          </Link> */}
          <Link href="/waitlist" className="my-1  underline underline-offset-4">
            join the waitlist
          </Link>
        </div>
      </div>
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

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
