import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Logo from './logo';

export default function Header() {
  return (
    <header className="flex w-full flex-row justify-between px-4 py-4">
      <div>
        <Logo />
      </div>
      <div>
        <Link
          href="/login"
          className="rounded-full bg-gray-50 px-3 py-2 font-bold shadow transition-all hover:bg-white"
        >
          log in
        </Link>
      </div>
    </header>
  );
}
