import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Logo from './logo';

export default function Header() {

 return (
    <header className='w-full flex flex-row justify-between px-4 py-4'>
      <div>        
        <Logo/>
      </div>
      <div>
        <Link href="/login" className='font-bold border rounded-full px-3 py-2 hover:bg-gray-100 transition-all'>
        log in
        </Link>
      </div>
    </header>
 );
}