import Logo from '@/app/ui/logo';
import { ArrowRightIcon, PencilSquareIcon, MicrophoneIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { FeatureCard } from './ui/FeatureCard';
import { FAQ } from './ui/FAQ';
import AuthForm from './auth-form';
import { Button } from './ui/button';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex py-10 border border-gray-50 shrink-0 items-start rounded-lg p-4">
        <Logo />
      </div>
      <div className="my-auto grid py-20 border rounded-lg w-full max-w-screen-xl mx-auto">
        
        <div className="flex flex-col items-center gap-2 rounded-lg px-6 md:my-auto md:px-20">
          <p className='font-bold text-gray-600 text-2xl md:text-5xl'>Automate your SOAP notes.</p> 
          <p className='text-gray-500 font-semibold text-lg md:text-4xl py-4'>Streamline patient intake and appointment documentation.</p>
          <div className='w-80 mt-12 h-48 mx-auto text-center'>
            <AuthForm />
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-4 max-w-screen-xl mx-auto lg:grid-cols-3">
        <FeatureCard 
          heading={"prepare"}
          icon={<PencilSquareIcon/>}
          subheading={"Come to appointments prepared."}
          textOne="Be prepared for your next appointment with insights that help you make the most out of your time with healthcare providers."
          textTwo='Receive personalized questions to ask your doctors based on your health history and current trends in medical research.'/>
        <FeatureCard 
          heading={"record"}
          icon={<MicrophoneIcon/>}
          subheading={"You have the right to record."}
          textOne={"Retain a permanent record of exactly what was said by medical providers. No more missed details, no more forgotten advice."}
          textTwo='Automatic transcriptions of your appointment recordings give you a record of exactly who said exactly what.'/>
          <FeatureCard 
          heading={"review"}
          icon={<ArchiveBoxIcon/>}
          subheading={"Search, review, and share."}
          textOne={"Share your transcribed recordings with family or approved caregivers."}
          textTwo='Get automatic recommendations of alternative approaches and recent medical research that may not have been highlighted during your appointments.'/>
      </div> 

      <div className="flex flex-col w-full max-w-[60rem] px-6 mx-auto my-20">
        <p className="mx-auto mb-8  text-gray-600 font-bold text-3xl dark:text-gray-400">
          Demo Video 
        </p>
        <div className='aspect-w-16 aspect-h-9'>
          <iframe src="https://www.youtube-nocookie.com/embed/8egWnTs9TM8?si=VQ3gBhxQb42Mtzdj" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
      </div>

      <div className="flex flex-col  max-w-[40rem] px-6 mx-auto my-20">
        <p className="mx-auto mb-8  text-gray-600 font-bold text-3xl dark:text-gray-400">
        FAQs 
        </p>
        <FAQ 
          question={"Does advocate.ai offer medical advice?"}
          answer={"advocate.ai is a patient-directed health advocacy tool that is meant to compliment your interactions with medical providers. This tool does not offer medical advice and is not a replacement for trained medical professionals."}
          />
        <FAQ 
          question={"Is my data safe?"}
          answer={"All user data is encrypted and stored in a secure database. No user data is shared with or sold to third parties."}
          />
        <FAQ 
          question={"Why would someone record a medical appointment if they already have electronic health records?"}
          answer={"Electronic health records are created by the provider. These records may contain errors or omit important details that were discussed during the interaction. Having your own full recording of the appointment allows you to review and share exactly what was said. These recordings compliment your electronic health records; advocate.ai enables you to make further use of this highly personalized information that would otherwise be lost." 
        }
          />       
          <FAQ 
          question={"Is it legal to record my medical appointments?"}
          answer={"You have the right to record your medical appointments. In most states, it is not necessary to request permission from your provider in order to make a recording. You must obtain consent from all parties to record in the following states: California, Connecticut, Florida, Illinois, Maryland, Massachusetts, Montana, New Hampshire, Oregon, Pennsylvania, and Washington."}
          />
          <FAQ 
          question={"Should doctors be worried about patients recording their appointments?"}
          answer={"No. The purpose of advocate.ai is to enable patients to come prepared, make the most of their medical appointments, and keep their caregivers accurately informed."}
          />
          
        
      </div>
    </main>
  );
}
