'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/app/ui/button';
import {
    CheckIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    UserCircleIcon, PencilSquareIcon
  } from '@heroicons/react/24/outline';
import AudioUpload from './AudioUpload';
// import getTranscript from '@/app/lib/actions';


export default function CreateAppointment() {
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [clinic, setClinic] = useState<string | null>(null)
  const [date, setDate] = useState<string>('')
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [tempDownloadUrl, setTempDownloadUrl] = useState<string | null>(null)
  const [submitOkay, setSubmitOkay] = useState<boolean>(true)
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const supabase = createClient()
  const router = useRouter()
  const [prediction, setPrediction] = useState(null)

  

  const submitAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
        setLoading(true)

        const { error, data } = await supabase.from('appointments').insert({
            created_at: new Date().toISOString(),
            audio_storage_url: recordingUrl,
            temp_audio_url: tempDownloadUrl,
          })
          .select();
    
          if (error) throw error
          tempDownloadUrl && getTranscript(tempDownloadUrl, data[0].id)
          router.push('/dashboard/appointments');
        } catch (error) {
          console.error('Error creating the appointment:', error);
        } finally {
          setLoading(false);
          
        }
      };


  return (
    
    <form onSubmit={submitAppointment}>
      <div className="flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Add appointment</h1>
      </div>

      <div className="rounded-md bg-gray-50 p-4 max-w-prose">
        
        <div className='grid grid-cols-2 gap-8'>

{/* Appointment Date */}
<div className="mb-4">
          <label htmlFor="appointment_date" className="mb-2 block text-sm font-medium">
            Appointment Date
          </label>
          <div className="relative">
            <input
              id="appointment_date"
              name="appointment_date"
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            >
            </input>
          </div>
          </div>


        {/* Appointment Time */}
        <div className="mb-4">
          <label htmlFor="appointment_time" className="mb-2 block text-sm font-medium">
            Appointment Time
          </label>
          <div className="relative">
            <input
              id="appointment_time"
              name="appointment_time"
              required
              type="time"
              // value={date}
              // onChange={(e) => setDate(e.target.value)}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            >
            </input>
          </div>
      </div>

        </div>
      
      <div className='grid grid-cols-2 gap-8'>
      <div className="mb-4">
           <label htmlFor="patient" className="mb-2 block text-sm font-medium">
             Patient Name
           </label>
           <div className="relative">
             <input
              id="patient"
              name="patient"
              required
              placeholder='Patient seen during visit'
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={provider || ''}
              onChange={(e) => setProvider(e.target.value)}
              aria-describedby='provider-error'
            >
              
            </input>
            <UserCircleIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
        </div>
        {/* Patient Date of Birth */}
        <div className="mb-4">
          <label htmlFor="appointment_date" className="mb-2 block text-sm font-medium">
            Patient Date of Birth
          </label>
          <div className="relative">
            <input
              id="patient_dob"
              name="patient_dob"
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            >
            </input>
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>


      <div className='grid grid-cols-2 gap-8'>
      <div className="mb-4">
           <label htmlFor="allergies" className="mb-2 block text-sm font-medium">
             Allergies
           </label>
           <div className="relative">
             <input
              id="allergies"
              name="allergies"
              required
              defaultValue={"NKDA"}
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              // value={provider || ''}
              // onChange={(e) => setProvider(e.target.value)}
            >
              
            </input>
          </div>
          
        </div>
        {/* Telemedicine Consent */}
        <div className="mb-4">
          <label htmlFor="consent" className="mb-2 block text-sm font-medium">
            Telemedicine Consent
          </label>
          <div className="relative flex flex-row items-center">
            <input
              id="consent"
              name="consent"
              required
              type='checkbox'
              value="true"
              // onChange={(e) => setDate(e.target.value)}
              className="peer block cursor-pointer w-6 h-6 mr-4 rounded-md border border-gray-200 text-sm outline-2 "
            >
            </input>
            <div className='text-sm'>Patient is located in Arizona and consents to treatment.</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
          Chief Complaint
        </label>
        <div className="relative">
          <input
          id="complaint"
          name="complaint"
          required
          type='text'
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          // value={provider || ''}
          // onChange={(e) => setProvider(e.target.value)}
        >
        </input>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="subjective" className="mb-2 block text-sm font-medium">
          Subjective
        </label>
        <div className="subjective">
          <textarea
          id="subjective"
          name="subjective"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          // value={provider || ''}
          // onChange={(e) => setProvider(e.target.value)}
        >
        </textarea>
      </div>
      </div>
        

            <div>
              <div className="px-2 mb-2 text-lg font-medium">
                Subjective:
              </div>
              <textarea className='w-full h-48 rounded-lg'>Therese Boshart, a 65-year-old female, presents today with a chief complaint of travel abroad. She is scheduled for a trip to Thailand lasting approximately one month and is concerned about the risk of contracting bacterial illnesses. She requests a travel pack of medications for prophylactic purposes. She reports no current symptoms.</textarea>
            </div>
    
            <div>
              <div className="px-2 mb-2 text-lg font-medium">
                Objective:
              </div>
              <textarea className='w-full h-48 rounded-lg'>Based on the patient's age and travel destination, a prophylactic travel pack has been prescribed, including:
    
              Cipro 500mg, 1 tablet orally twice daily for 10 days, dispense 20 tablets
              Flagyl 500mg, 1 tablet orally twice daily for 10 days, dispense 20 tablets
              Z-Pak (dispensed as directed)
              Zofran 4mg orally disintegrating tablet, to be taken as needed for nausea or vomiting
              Keflex 500mg, 1 tablet orally three times daily for 10 days, dispense 30 tablets
              Travalon (over-the-counter supplement), advised for prevention of traveler's diarrhea and parasites</textarea>
            </div>
    
            <div>
              <div className="px-2 mb-2 text-lg font-medium">
                Assessment:
              </div>
              <textarea className='w-full h-48 rounded-lg'>Therese Boshart is a 65-year-old female planning travel to Thailand. Given her concerns about potential bacterial illnesses, a prophylactic travel pack has been prescribed to address common ailments. Patient is well-informed about the medications provided and their purposes.</textarea>
            </div>
    
            <div>
              <div className="px-2 mb-2 text-lg font-medium">
                Plan:
              </div>
              <textarea className='w-full h-48 rounded-lg'>Patient has been educated about utilizing the provided medications in case of illness during her trip. She is advised to contact via call, text, or email if symptoms arise, and further guidance will be provided accordingly.</textarea>
            </div>
              
              
            
        

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/appointments"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" active={!isUploading}>Add Appointment</Button>
      </div>
      </div>
    </form>
    


  )
}