import Logo from '@/app/ui/logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import FeatureCard from './ui/FeatureCard';
import FAQ from './ui/FAQ';

import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex h-20 py-10 shrink-0 items-start rounded-lg p-4 md:h-40">
        <Logo />
      </div>
      <div className="mt-2 flex grow flex-col gap-2">
        <div className="flex flex-col items-center gap-2 rounded-lg px-6 md:py-20 md:px-20">
          <p className='font-bold text-gray-600 text-xl md:text-5xl md:pt-8'>Record your medical appointments.</p> 
          <p className='text-gray-500 font-semibold md:text-4xl py-4 md:mb-8'>Get clarity, accountability, and better outcomes.</p>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-5 rounded-lg bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-500 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          
        </div>
        
      </div>
      
      <div className="mt-4 flex grow flex-col gap-4 md:px-2 md:flex-row">
        <FeatureCard 
          heading={"prepare"}
          subheading={"Get support preparing for your medical appointments."}
          text={"Receive personalized questions to ask your doctors based on your health history and current trends in medical research. Be prepared for your next appointment with insights that help you make the most out of your time with healthcare providers."}/>
        <FeatureCard 
          heading={"record"}
          subheading={"Capture your medical appointments with our easy and secure audio recording tool."}
          text={"Automatic transcriptions of your appointment recordings give you a record of exactly who said exactly what. No more missed details, no more forgotten advice. Recordings and transcripts are stored permanently in a secure, encrypted environment."}/>
          <FeatureCard 
          heading={"review"}
          subheading={"Search, review, and interact with your healthcare provider conversations."}
          text={"Share your transcribed recordings with family or approved caregivers. Identify potential irregularities. Get recommendations of alternative approaches and recent medical research that may not have been highlighted during your appointments."}/>

        
      </div>
      <div className="flex flex-col w-[40rem] mx-auto md:my-20">
        <p className="mx-auto mb-8  text-gray-600 font-bold text-3xl dark:text-gray-400">
        FAQs 
        </p>
        <FAQ 
          question={"Does advocate.ai offer medical advice?"}
          answer={"advocate.ai is a patient-directed health advocacy tool that is meant to compliment your interactions with medical providers. This tool does not offer medical advice and is not a replacement for trained medical professionals."}
          />
        <FAQ 
          question={"Is my data safe?"}
          answer={"‍advocate.ai encrypts and stores all user data in secure storage. No data is sold to third parties."}
          />
        <FAQ 
          question={"Is advocate.ai HIPAA compliant?"}
          answer={"‍The app is patient-directed and does not receive electronic medical information from a Covered Provider and is therefore not covered by HIPAA. advocate.ai protects personal health information (PHI) and is fully compliant with FDA and FTC regulations on patient recordings of consults."}
          />
        <FAQ 
        question={"Is recording legal?"}
        answer={"You have the right to record your medical appointments. In most states, it is not necessary to request permission from your provider in order to make a recording. You must obtain consent from all parties to record in the following states: California, Connecticut, Florida, Illinois, Maryland, Massachusetts, Montana, New Hampshire, Pennsylvania, and Washington."}
          />
        <FAQ 
          question={"What if there are signs saying recording isn’t allowed?"}
          answer={"Those signs are to keep you from recording other patients. There’s nothing wrong with asking your doctor if it’s okay to record your consultation."}
          />
        
      </div>
    </main>
  );
}
