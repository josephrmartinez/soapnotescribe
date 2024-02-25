'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShareIcon,
  PencilSquareIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';




export default function ShareAppointmentForm() {

    const router = useRouter()


  return (
    <div className='max-w-lg mx-auto'>
        <div className="rounded-md bg-white shadow-md p-6 ">
        <fieldset>
            <legend className='font-semibold'>Share the following:</legend>

            <div className='my-4'>
                <input type="checkbox" id="audio" name="audio" />
                <label htmlFor="audio" className='ml-2'>Audio</label>
            </div>

            <div className='my-4'>
                <input type="checkbox" id="transcript" name="transcript" />
                <label htmlFor="transcript" className='ml-2'>Transcript</label>
            </div>

            <div className='my-4'>
                <input type="checkbox" id="summary" name="summary" />
                <label htmlFor="summary" className='ml-2'>Summary</label>
            </div>

            <div className='my-4'>
                <input type="checkbox" id="feedback" name="feedback" />
                <label htmlFor="feedback" className='ml-2'>Advocate Feedback</label>
            </div>

            <div className='my-4 flex flex-col'>
                <label htmlFor="email" className='font-semibold'>Recipient's email address</label>
                <input type="text" id="email" name="email" />
            </div>

        </fieldset>

        </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
            onClick={() => router.back()}
            className="cursor-pointer flex flex-row w-24 h-10 rounded-md border p-2 bg-teal-600 text-gray-50 transition-colors hover:bg-teal-500"
        >
            <ShareIcon className="w-6" />
            <div className='tracking-wider ml-1'>share</div>
        </button>
        
      </div>
    </div>
  );
}

