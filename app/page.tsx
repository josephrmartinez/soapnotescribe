import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { inter } from '@/app/ui/fonts'
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-gray-100 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/3 md:px-20">
          <p className={`text-xl text-gray-600 md:leading-normal`}>
            <p className='font-bold md:text-3xl md:py-8'>Record your medical appointments.</p> 
            <p className='md:py-4'>Get clarity, accountability, and better outcomes.</p>
          </p>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-2/3 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/3 md:px-20">
          <p className={` ${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>prepare.</strong> Get support preparing for your medical appointments.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/3 md:px-20">
          <p className={` ${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>record.</strong> Capture your medical appointments with our easy and secure audio recording tool.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/3 md:px-20">
          <p className={` ${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>review.</strong> Search, review, and interact with your healthcare provider conversations.
          </p>
        </div>
        
      </div>
    </main>
  );
}
