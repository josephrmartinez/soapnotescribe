import { poppins } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/dashboard/notes">
      <p className={`${poppins.className} text-xl text-gray-700 font-semibold`}>soapscribe.app</p>
    </Link>
  );
}
