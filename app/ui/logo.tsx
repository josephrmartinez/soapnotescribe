import { poppins } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/">
      <p className={`${poppins.className} text-xl font-semibold text-gray-700`}>
        soapscribe.app
      </p>
    </Link>
  );
}
