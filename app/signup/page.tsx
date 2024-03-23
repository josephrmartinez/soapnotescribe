import React from 'react'
import Logo from '../ui/logo'
import { signup } from './action'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="rounded-md p-6 border  w-[300px]">
        <div className="flex justify-center mb-6 mt-2"><Logo/></div>
        
        <form className='flex flex-col gap-2'>
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" required />
          <Label htmlFor="password">Password:</Label>
          <Input id="password" name="password" type="password" required/>
          <Separator />
          <Button formAction={signup}>Sign up</Button>
        </form>
        <div className='flex flex-col items-center mt-6'>
          <p className='text-gray-500'>Already have an account?</p>
          <Link href='/login' className='underline  underline-offset-4 my-1'>log in</Link>
        </div>
      </div>
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Button: React.FC<ButtonProps> = ({children, ...rest}) => {
  return <button className="rounded bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 transition duration-100 ease-in-out" {...rest}>
    {children}
  </button>
}
const Input: React.FC<InputProps> = ({...rest}) => {
  return <input className="rounded px-4 py-2  outline-none bg-gray-100 border border-white/10 focus:bg-white focus:text-black" {...rest}/>
}

const Label: React.FC<LabelProps> = ({children, ...rest}) => {
  return <label {...rest} className="text-sm ">{children}</label>
}


const Separator = () => <hr className="border-white/10 my-2"/>