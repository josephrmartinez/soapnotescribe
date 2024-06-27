'use client';

import React, { useState } from 'react';
import Logo from '../ui/logo';
import { login, AuthResult } from './action';
import Link from 'next/link';
import { SubmitButton } from '../ui/SubmitButton';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const submitOkay = password !== '' && email !== '';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await login(formData);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-between bg-gray-50 p-24">
      <div className="w-[300px] rounded-md bg-gray-50 p-6">
        <div className="mb-6 mt-2 flex justify-center">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
          <SubmitButton active={submitOkay}>
            {loading ? 'Loading' : 'Log in'}
          </SubmitButton>
          {/* <SubmitFormButton formAction={login}/> */}
        </form>
        <div className="flex flex-col items-center">
          <div className="my-6 h-6 text-center font-semibold text-red-700">
            <div>{error ? `${error}` : ''}</div>
          </div>

          <p className="text-gray-500">Don't yet have an account?</p>

          <Link
            href="/waitlist"
            className="my-1 text-center underline underline-offset-4"
          >
            join the waitlist
          </Link>
        </div>
      </div>
    </div>
  );
}

{
  /* <Link href="/signup" className="my-1  underline underline-offset-4">
            sign up for free
          </Link> */
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
