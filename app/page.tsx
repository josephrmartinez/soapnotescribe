import Logo from '@/app/ui/logo';
import { ArrowRightIcon, PencilSquareIcon, MicrophoneIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { PricingCard } from './ui/PricingCard';
import { UseStep } from './ui/UseStep';
import Link from 'next/link';
import Header from './ui/Header';


export default function Page() {
  return (
    <main className="flex h-full flex-col p-2">
    <Header />

    <div className='max-w-screen-lg mx-auto'>

      <p className="mt-20 mx-auto mb-8 text-center text-gray-900 font-bold text-5xl ">
      Automate your SOAP notes 
      </p>

        <p className='text-gray-600  text-xl max-w-prose mx-auto text-center py-4'>Upload appointment audio recordings or post-appointment voice memos and soapscribe does the rest - analyzing, structuring, and saving notes securely in a HIPAA-compliant database.</p>

        <div className='flex flex-row items-center align-middle justify-center mx-auto my-8'>
        <Link href='/signup' className=' text-center w-32 bg-teal-600 text-white font-bold rounded-full py-3 mx-2 hover:bg-teal-500 hover:text-white'>get started</Link>
        <Link href='#pricing' className='w-32 font-bold underline underline-offset-8 rounded-full py-4 mx-2 hover:text-teal-600'>see pricing</Link>
        </div>

        <p className="mt-20 mx-auto mb-8 text-center text-gray-600 font-bold text-3xl dark:text-gray-400">
      Easy to use: 
        </p>
      <div className="my-20 grid grid-cols-2 gap-4 max-w-screen-xl mx-auto">
        <UseStep icon={<MicrophoneIcon/>}
        step='1. Upload audio'
        subtext='Upload post-appointment clinical note voice memos or a recording of the entire appointment. Soapscribe will intelligently extract the relevant information.'
        />
        <div className='border rounded-lg'></div>
        <UseStep icon={<PencilSquareIcon/>}
        step='2. Edit draft'
        subtext='A structured SOAP note is available in seconds for easy review and approval. Make quick edits instead of starting each note from scratch.'
        />
        <div className='border rounded-lg'></div>
        <UseStep icon={<ArchiveBoxIcon/>}
        step='3. Approve and save'
        subtext='Your notes are saved in a HIPPA-compliant database that is easy to search and review.'
        />
        <div className='border rounded-lg'></div>
      
      </div>

      <p className="mt-20 mx-auto mb-8 text-center text-gray-600 font-bold text-3xl ">
      Simple pricing 
        </p>

        <div id='pricing' className='grid grid-cols-2 gap-4 mx-auto mb-12 items-center'>
        <PricingCard 
        plan='free'
        price='0'
        featureOne='Limited to 10 notes per month'
        featureTwo='30 minute recording limit'
        featureThree='Standard procedure templatess'
        /> 
        <PricingCard 
        plan='pro'
        price='99'
        featureOne='Unlimited SOAP notes'
        featureTwo='Unlimited recording length'
        featureThree='Create custom templates'
        />

        </div>
      
      </div>
    </main>
  );
}
