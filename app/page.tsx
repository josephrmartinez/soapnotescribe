import Logo from '@/app/ui/logo';
import { ArrowRightIcon, PencilSquareIcon, MicrophoneIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { FeatureCard } from './ui/FeatureCard';
import { FAQ } from './ui/FAQ';
import AuthForm from './auth-form';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex h-20 py-10 border border-gray-50 shrink-0 items-start rounded-lg p-4 md:h-40">
        <Logo />
      </div>
      <div className="my-12 md:mt-2 grid grid-cols-3 gap-4 md:px-2">
        <div className="col-span-2 flex flex-col items-center gap-2 rounded-lg px-6 md:py-20 md:px-20">
          <p className='font-bold text-gray-600 text-xl md:text-5xl md:pt-8'>Record your medical appointments.</p> 
          <p className='text-gray-500 font-semibold md:text-4xl py-4 md:mb-8'>Get clarity, accountability, and better outcomes.</p>
        </div>
        <AuthForm />
      </div>
      
      <div className="mt-4 flex grow flex-col gap-4 md:px-2 md:flex-row">
        <FeatureCard 
          heading={"prepare"}
          icon={<PencilSquareIcon/>}
          subheading={"Get support preparing for your medical appointments."}
          text={"Be prepared for your next appointment with insights that help you make the most out of your time with healthcare providers. Receive personalized questions to ask your doctors based on your health history and current trends in medical research."}/>
        <FeatureCard 
          heading={"record"}
          icon={<MicrophoneIcon/>}
          subheading={"You have the right to record your medical appointments."}
          text={"Automatic transcriptions of your appointment recordings give you a record of exactly who said exactly what. No more missed details, no more forgotten advice. Recordings and transcripts are stored permanently in a secure, encrypted environment."}/>
          <FeatureCard 
          heading={"review"}
          icon={<ArchiveBoxIcon/>}
          subheading={"Search, review, and interact with your healthcare provider conversations."}
          text={"Share your transcribed recordings with family or approved caregivers. Identify potential irregularities. Get automatic recommendations of alternative approaches and recent medical research that may not have been highlighted during your appointments."}/>
      </div> 
      <div className="flex flex-col w-[40rem] mx-auto md:my-20">
        <p className="mx-auto mb-8  text-gray-600 font-bold text-3xl dark:text-gray-400">
        FAQs 
        </p>
        <FAQ 
          question={"Does advocate.ai offer medical advice?"}
          answer={"No. advocate.ai is a patient-directed health advocacy tool that is meant to compliment your interactions with medical providers. This tool does not offer medical advice and is not a replacement for trained medical professionals."}
          />
        <FAQ 
          question={"Is my data safe?"}
          answer={"‍All user data is encrypted and stored in secure storage. No user data is sold to third parties. No AI models are trained on user data."}
          />
        <FAQ 
          question={"Why would someone record a medical appointment if they already have electronic health records?"}
          answer={"Electronic health records are created by the provider. These records are subject to human error and may not contain important details that were discussed during the interaction. We recommend recording the entire appointment as well as any interactions with front office staff. If there is ever a legal issue that arises, having your own audio recording of the entire medical appointment could be of significant importance. These recordings will compliment your electronic health records ad allow you to generate highly personalized pre and post appointment feedback that would not be possible otherwise." 
        }
          />       
          <FAQ 
          question={"Is recording legal?"}
          answer={"You have the right to record your medical appointments. In most states, it is not necessary to request permission from your provider in order to make a recording. You must obtain consent from all parties to record in the following states: California, Connecticut, Florida, Illinois, Maryland, Massachusetts, Montana, New Hampshire, Pennsylvania, and Washington."}
          />
          <FAQ 
          question={"Is advocate.ai HIPAA compliant?"}
          answer={"‍The app is patient-directed and does not receive electronic medical information from a Covered Provider and is therefore not covered by HIPAA. advocate.ai protects personal health information (PHI) and is fully compliant with FDA and FTC regulations on patient recordings of consults."}
          />
        
      </div>
    </main>
  );
}
