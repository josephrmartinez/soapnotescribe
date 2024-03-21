import Logo from '@/app/ui/logo';
import { ArrowRightIcon, PencilSquareIcon, MicrophoneIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { FeatureCard } from './ui/FeatureCard';
import { PricingCard } from './ui/PricingCard';
import { FAQ } from './ui/FAQ';
import AuthForm from './auth-form';
import { Button } from './ui/button';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-2">
      <div className="flex py-6 border border-gray-50 shrink-0 items-start rounded-lg p-4">
        <Logo />
      </div>

    <div className='max-w-screen-lg mx-auto'>


    


      <div className="my-auto grid py-20 border rounded-lg w-full  mx-auto">
        
        <div className="flex flex-col items-center gap-2 rounded-lg px-6 md:my-auto md:px-20">
          <p className='font-bold text-gray-700 text-2xl md:text-6xl'>Automate your SOAP notes.</p> 
          <p className='text-gray-600  text-lg md:text-3xl py-4'>Streamline patient intake and appointment documentation.</p>

          <div className='w-80 mt-12 h-48 mx-auto text-center'>
            <AuthForm />
          </div>
          




        </div>
      </div>
      <p className="mt-20 mx-auto mb-8 text-center text-gray-600 font-bold text-3xl dark:text-gray-400">
      Effortlessly generate structured SOAP notes. 
        </p>
        <p className='text-gray-600  text-xl max-w-prose mx-auto text-center py-4'>Upload appointment audio recordings or post-appointment voice memos and soapscribe does the rest - analyzing, structuring, and saving notes securely in a HIPAA compliant database. Streamline your workflow with useful AI.</p>
      <div className="my-20 grid grid-cols-1 gap-4 max-w-screen-xl mx-auto lg:grid-cols-3">
        
        <FeatureCard 
          heading={"record"}
          icon={<MicrophoneIcon/>}
          subheading={"Accurate, high-quality transcriptions."}
          textOne={"Capture full appointments or just post-appointment notes."}
          textTwo=''/>
          <FeatureCard 
          heading={"review"}
          icon={<PencilSquareIcon/>}
          subheading={"Structured clinical notes."}
          textOne="Make quick edits instead of starting each note from scratch."
          textTwo=''/>
          <FeatureCard 
          heading={"save"}
          icon={<ArchiveBoxIcon/>}
          subheading={"Simple document storage and review."}
          textOne={"Securely share your clinical notes with other providers."}
          textTwo=''/>
      </div>

      <p className="mt-20 mx-auto mb-8 text-center text-gray-600 font-bold text-3xl dark:text-gray-400">
      Simple pricing 
        </p>
        
      <div className="my-20 grid grid-cols-1 gap-4 max-w-screen-xl mx-auto lg:grid-cols-2">
        
        <PricingCard 
        plan='free'
        price='0'
        featureOne='Limited to 10 notes per month'
        featureTwo='30 minute recording limit'
        /> 
        <PricingCard 
        plan='pro'
        price='99'
        featureOne='Unlimited SOAP notes'
        featureTwo='Unlimited recording length'
        />

    
      </div>

      </div>
    </main>
  );
}
