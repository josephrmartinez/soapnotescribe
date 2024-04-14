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

      <div className="mx-auto max-w-screen-lg">
        <p className="mx-auto mb-8 mt-20 text-center text-5xl font-bold text-gray-900 ">
          Automate your SOAP notes
        </p>

        <p className="mx-auto  max-w-prose py-4 text-center text-xl text-gray-600">
          Upload appointment audio recordings or post-appointment voice memos
          and soapscribe does the rest - analyzing, structuring, and saving
          notes securely in a HIPAA-compliant database.
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
          Easy to use:
        </p>
        <div className="mx-auto my-20 grid max-w-screen-xl grid-cols-2 gap-4">
          <UseStep
            icon={<MicrophoneIcon />}
            step="1. Upload audio"
            subtext="Upload post-appointment clinical note voice memos or a recording of the entire appointment. Soapscribe will intelligently extract the relevant information."
          />
          <div className="rounded-lg border"></div>
          <UseStep
            icon={<PencilSquareIcon />}
            step="2. Edit draft"
            subtext="A structured SOAP note is available in seconds for easy review and approval. Make quick edits instead of starting each note from scratch."
          />
          <div className="rounded-lg border"></div>
          <UseStep
            icon={<ArchiveBoxIcon />}
            step="3. Approve and save"
            subtext="Your notes are saved in a HIPPA-compliant database that is easy to search and review."
          />
          <div className="rounded-lg border"></div>
        </div>

        <p className="mx-auto mb-8 mt-20 text-center text-3xl font-bold text-gray-600 ">
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
        </div>
      </div>
    </main>
  );
}
