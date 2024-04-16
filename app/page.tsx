import Logo from '@/app/ui/logo';
import {
  ArrowRightIcon,
  PencilSquareIcon,
  MicrophoneIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { PricingCard } from './ui/PricingCard';
import { UseStep } from './ui/UseStep';
import Link from 'next/link';
import Image from 'next/image';
import Header from './ui/Header';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (data.user) {
    redirect('/dashboard/notes');
  }

  return (
    <main className="flex h-full flex-col p-2">
      <Header />

      <div className="mx-auto">
        <p className="mx-auto mb-8 mt-20 text-center text-5xl font-black text-gray-700 ">
          Automate your clinical charting.
        </p>
        <p className="mx-auto text-center text-3xl font-semibold text-gray-600">
          Go from audio memo to structured SOAP note in seconds.
        </p>

        <div className="mx-auto my-8 flex flex-row items-center justify-center align-middle">
          <Link
            href="/signup"
            className=" mx-2 w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white hover:bg-teal-500 hover:text-white"
          >
            get started
          </Link>
          <Link
            href="#pricing"
            className="mx-2 w-32 rounded-full py-4 font-bold underline underline-offset-8 hover:text-teal-600"
          >
            see pricing
          </Link>
        </div>
        <p className="mx-auto mb-8 mt-20 text-center text-3xl font-bold text-gray-600 dark:text-gray-400">
          Easy to use. No setup required.
        </p>
        <div className="flex w-full flex-col items-center bg-gray-200 px-8 py-16">
          <Image
            alt="soapscribe demo"
            width={1000}
            height={1000}
            src="/soapscribedemo.gif"
            unoptimized={true}
            className="rounded-lg shadow-lg"
          ></Image>
        </div>
        <div className="mx-auto my-20 grid max-w-screen-xl grid-cols-3 gap-1">
          <UseStep
            icon={<MicrophoneIcon />}
            step="1. Upload audio"
            subtext="Upload clinical audio memos or a recording of the entire appointment. Soapscribe will intelligently extract the relevant information."
          />

          <UseStep
            icon={<PencilSquareIcon />}
            step="2. Review draft"
            subtext="A structured SOAP note is available in seconds for easy review and approval. Make quick edits instead of starting each note from scratch."
          />

          <UseStep
            icon={<ArchiveBoxIcon />}
            step="3. Approve and save"
            subtext="Your notes are saved in a HIPPA-compliant database that is easy to search and review."
          />
        </div>

        <div className="rounded-lg border"></div>
        <div className="rounded-lg border"></div>
        <div className="rounded-lg border"></div>

        {/* <p className="mx-auto mb-8 mt-20 text-center text-3xl font-bold text-gray-600 ">
          Simple pricing
        </p>

        <div
          id="pricing"
          className="mx-auto mb-12 grid grid-cols-2 items-center gap-4"
        >
          <PricingCard
            plan="free"
            price="0"
            featureOne="Limited to 10 notes per month"
            featureTwo="30 minute recording limit"
            featureThree="Standard templates"
          />
          <PricingCard
            plan="pro"
            price="99"
            featureOne="Unlimited SOAP notes"
            featureTwo="Unlimited recording length"
            featureThree="Create custom templates"
          />
        </div> */}
      </div>
    </main>
  );
}
