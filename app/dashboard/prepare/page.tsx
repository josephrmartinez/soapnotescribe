import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import Search from '@/app/ui/search';
import { PencilIcon, PlusIcon, TrashIcon, ArrowRightIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';



export const metadata: Metadata = {
  title: "Prepare",
}
 
export default async function Page() {


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>Prepare for Upcoming Appointments</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className='text-gray-700'>Fill out any of the fields below for help with generating questions to ask at your next appointment:</div>
      </div>

      <div className='grid grid-cols-2 mt-8 gap-8'>
        <div>
          <div className='text-gray-600 font-semibold'>Type of appointment:</div>
          <input type='text' className='border border-gray-300 rounded-lg mb-6'></input>

          <div className='text-gray-600 font-semibold'>Health concerns:</div>
          <input type='text' className='border border-gray-300 rounded-lg w-full mb-6'></input>

          <div className='text-gray-600 font-semibold'>What would you like to get out of the appointment?</div>
          <input type='text' className='border border-gray-300 rounded-lg w-full mb-6'></input>

          <div className='text-gray-600 font-semibold'>Do you have any concerns about this provider?</div>
          <input type='text' className='border border-gray-300 rounded-lg w-full mb-6'></input>

          <div className='flex flex-row w-full justify-end'>
            <button
              className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span className="hidden md:block">Generate questions</span>{' '}
              <ArrowRightIcon className="h-5 md:ml-4" />
            </button>
          </div>
          
        </div>

        <div>
          <div className='text-gray-600 font-semibold'>Questions for your upcoming appointment:</div>
          <textarea className='border border-gray-300 rounded-lg w-full h-full'
          placeholder='AI generated questions will appear here.'>
          </textarea>
        </div>

      </div>

      
    </div>
  )
}