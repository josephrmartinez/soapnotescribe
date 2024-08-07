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
import { fetchPatientCount } from './lib/data';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (data.user) {
    // get number of patients. If 0, redirect to 'add patient' page.
    const count = await fetchPatientCount();
    if (count === null) {
      redirect('/dashboard/patients/add');
    }
    redirect('/dashboard/notes');
  }

  return (
    <main className="bg-gray-50">
      <Header />

      {/* Mobile view */}
      <div className="mx-auto grid justify-items-center  bg-gray-50 md:hidden">
        <div className="mt-12 w-full px-4 text-left text-3xl font-semibold text-teal-700">
          <p>Streamline your</p>
          <p>clinical charting.</p>
        </div>
        <div className=" grid grid-cols-3 px-4">
          <div className="col-span-2 my-6 text-left text-lg text-gray-600">
            <p>Go from audio memo</p>
            <p>or appointment recording</p>
            <p>to structured SOAP note</p>
            <p>
              in <span className="underline underline-offset-4">seconds</span>.
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src="/hipaa.svg"
              width={160}
              height={160}
              alt="HIPAA compliant"
              className=""
            ></Image>
          </div>
        </div>
        <div className="my-2"></div>

        <div className="flex w-full flex-col items-center justify-center bg-[#B30A2A43] py-4">
          <Image
            alt="soapscribe demo"
            width={300}
            height={300}
            src="/demo-mobile.gif"
            unoptimized={true}
            className="my-8 rounded-lg shadow-lg"
          ></Image>
          <div className="justify-items-between my-4 grid w-[300px] grid-cols-2 items-center justify-center pb-4 align-middle">
            <Link
              href="/waitlist"
              className=" mx-2 w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white shadow-md transition-all hover:bg-teal-500 hover:text-white"
            >
              join waitlist
            </Link>
            <Link
              href="#pricing"
              className="mx-2 w-32 rounded-full border bg-white py-3 text-center font-bold transition-all hover:text-teal-600"
            >
              see pricing
            </Link>
          </div>
        </div>
        <div className="my-4"></div>

        <div className="mt-2 w-full px-14 text-left text-3xl font-semibold text-gray-500">
          <p>Chart</p>
          <p>
            <span className="underline underline-offset-4">faster</span> with
          </p>
          <p>soapnotescribe:</p>
        </div>

        <div className="mx-auto my-12 grid max-w-screen-lg gap-8 px-8 md:mt-8 md:grid-cols-3">
          <UseStep
            icon={<MicrophoneIcon />}
            step="1. Upload audio"
            subtext="Upload a clinical audio memo or an entire appointment recording. soapnotescribe will intelligently extract the relevant information."
          />

          <UseStep
            icon={<PencilSquareIcon />}
            step="2. Review draft"
            subtext="A structured SOAP note is available in seconds for easy review. Make quick edits instead of starting notes from scratch."
          />

          <UseStep
            icon={<ArchiveBoxIcon />}
            step="3. Approve note"
            subtext="Finalize your note with an e-signature. Notes are saved in an easily searchable, HIPPA-compliant database."
          />
        </div>

        <div id="pricing" className="mx-auto grid items-center gap-8 pb-12">
          <div>
            <div className="mx-auto pb-4 text-center text-2xl font-semibold text-gray-600">
              No gimmicks:
            </div>
            <div className="text-md grid w-full gap-4 px-2 text-center text-gray-700">
              <p className="">Freely export notes to other EHR platforms.</p>
              <p className="">No complex setup. No demo call required.</p>
            </div>
          </div>

          <div>
            <div className="mx-auto pb-4 text-center text-2xl font-semibold text-gray-600">
              Simple pricing:
            </div>
            <div className="text-md grid w-full gap-4 px-2 text-center  text-gray-700">
              <p className="">
                First ten notes free, then{' '}
                <span className="underline underline-offset-4">
                  $29 per month
                </span>
                .
              </p>
              <p className="">Cancel your account at any time.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-[#B30A2A43] pt-6">
          <Image
            alt="soapscribe mobile screenshot"
            width={300}
            height={300}
            src="/screenshot-mobile.webp"
            className="my-8 rounded-lg shadow-lg"
          ></Image>
        </div>
        <div className="flex w-full bg-[#B30A2A43] pb-12 pt-4">
          <Link
            href="/waitlist"
            className="mx-auto w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white shadow-lg hover:bg-teal-500 hover:text-white"
          >
            join waitlist
          </Link>
        </div>
      </div>

      {/* Desktop view */}
      <div className="mx-auto hidden justify-items-center md:grid">
        <p className="mx-auto mt-20 px-6 text-center text-5xl font-semibold text-teal-700 ">
          Streamline your clinical charting.
        </p>
        <p className="mx-auto my-8 text-center  text-2xl text-gray-500 md:text-2xl">
          Go from audio memo to structured SOAP note in{' '}
          <span className="underline underline-offset-4">seconds</span>.
        </p>

        <div className="mx-auto flex flex-row items-center justify-center pb-8 align-middle">
          <Link
            href="/waitlist"
            className="mx-2 w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white shadow-md transition-all hover:bg-teal-500 hover:text-white"
          >
            join waitlist
          </Link>

          <Link
            href="#pricing"
            className="mx-2 w-32 rounded-full border py-3 text-center font-bold transition-all hover:text-teal-600"
          >
            see pricing
          </Link>
          <Image
            src="/hipaa.svg"
            width={120}
            height={120}
            alt="HIPAA compliant"
            className=""
          ></Image>
        </div>

        <div className="flex w-full  items-center justify-center bg-[#B30A2A43] py-16">
          <div className="mx-auto flex w-11/12 flex-col items-center">
            <Image
              alt="soapnotescribe demo"
              width={1000}
              height={1000}
              src="/demo-desktop.gif"
              unoptimized={true}
              className="rounded-lg shadow-lg"
            ></Image>
          </div>
        </div>
        <div className="mx-auto mb-6 mt-12 w-full text-center text-4xl font-semibold text-gray-500">
          <p>
            Chart <span className="underline underline-offset-4">faster</span>{' '}
            with soapnotescribe:
          </p>
        </div>
        <div className="mx-auto my-8 grid w-11/12 max-w-screen-lg grid-cols-3 gap-4">
          <UseStep
            icon={<MicrophoneIcon />}
            step="1. Upload audio"
            subtext="Upload clinical audio memos or an entire appointment recording. soapnotescribe will intelligently extract the relevant information."
          />

          <UseStep
            icon={<PencilSquareIcon />}
            step="2. Review draft"
            subtext="A structured SOAP note is available in seconds for easy review. Make quick edits instead of starting notes from scratch."
          />

          <UseStep
            icon={<ArchiveBoxIcon />}
            step="3. Approve note"
            subtext="Finalize your note with an e-signature. Notes are saved in an easily searchable, HIPPA-compliant database."
          />
        </div>
        <div
          id="pricing"
          className="mx-auto grid grid-cols-2 items-center gap-8 px-8 pb-12 pt-8"
        >
          <div>
            <div className="mx-auto pb-4 text-center text-2xl font-semibold text-gray-600">
              No gimmicks:
            </div>
            <div className="grid w-full gap-4 px-2 text-center text-lg text-gray-700">
              <p className="">Freely export notes to other EHR platforms.</p>
              <p className="">No complex setup. No demo call required.</p>
            </div>
          </div>

          <div>
            <div className="mx-auto pb-4 text-center text-2xl font-semibold text-gray-600">
              Simple pricing:
            </div>
            <div className="grid w-full gap-4 px-2 text-center text-lg  text-gray-700">
              <p className="">
                First ten notes free, then{' '}
                <span className="underline underline-offset-4">
                  $29 per month
                </span>
                .
              </p>
              <p className="">Cancel your account at any time.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-[#B30A2A43] py-8">
          <div className="mx-auto flex w-11/12 flex-col items-center">
            <Image
              alt="soapscribe desktop screenshot"
              width={1000}
              height={1000}
              src="/screenshot-desktop.webp"
              className="my-8 rounded-lg shadow-lg"
            ></Image>
          </div>
        </div>
        <div className="flex w-full bg-[#B30A2A43] pb-12 pt-4">
          <Link
            href="/waitlist"
            className="mx-auto w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white shadow-lg hover:bg-teal-500 hover:text-white"
          >
            join waitlist
          </Link>
        </div>

        {/* <Link
            href="/signup"
            className="mx-auto w-32 rounded-full bg-teal-600 py-3 text-center font-bold text-white shadow-md hover:bg-teal-500 hover:text-white"
          >
            get started
          </Link> */}
      </div>
    </main>
  );
}
