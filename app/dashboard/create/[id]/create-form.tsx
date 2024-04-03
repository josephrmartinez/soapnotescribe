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
import { Appointment } from '@/app/lib/definitions';
import { getSignedAudioUrl } from '@/app/lib/data';

interface CreateAppointmentProps {
    appointment?: Appointment;
   }


const CreateAppointmentPrefilled: React.FC<CreateAppointmentProps> = ({ appointment }) => {
  // pass in Appointment object data to pre-populate form, or do not pass in an Appointment object to just use a blank form
  const [loading, setLoading] = useState<boolean>(true)
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [patientName, setPatientName] = useState<string | null>(appointment?.patient_name || null)
  const [chiefComplaint, setChiefComplaint] = useState<string | null>(appointment?.chief_complaint || null)
  const [date, setDate] = useState<string>(appointment?.appointment_date || '')
  const [appointmentTime, setAppointmentTime] = useState<string>(appointment?.appointment_time || '')
  const [patientDateOfBirth, setPatientDateOfBirth] = useState<string>(appointment?.patient_date_of_birth || '')
  const [allergies, setAllergies] = useState<string>(appointment?.allergies || '')
  const [consent, setConsent] = useState<string | null>(null)
  const [subjective, setSubjective] = useState<string | null>(appointment?.soap_subjective || null)
  const [objective, setObjective] = useState<string | null>(appointment?.soap_objective || null)
  const [assessment, setAssessment] = useState<string | null>(appointment?.soap_assessment || null)
  const [plan, setPlan] = useState<string | null>(appointment?.soap_plan || null)
  const [submitOkay, setSubmitOkay] = useState<boolean>(true) 

  console.log("appointment data from client CreateAppointmentPrefilled:", appointment)

  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (appointment?.audio_storage_url) {
        try {
        const url = await getSignedAudioUrl(appointment.user_id, appointment.audio_storage_url);
        console.log("signed url:", url)
        setAudioUrl(url);
        } catch (error) {
            console.error("Error fetching audio url:", error);
        }
      }
    };

    fetchAudioUrl();
  }, []);

  
  const supabase = createClient()
  const router = useRouter()

  const submitAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
        setLoading(true)
        const { error, data } = await supabase.from('appointments').insert({
            created_at: new Date().toISOString(),
            
          })
          .select();
          if (error) throw error
          router.push('/dashboard/appointments');
        } catch (error) {
          console.error('Error creating the appointment:', error);
        } finally {
          setLoading(false);
        }
      };


  return (
    <form onSubmit={submitAppointment} className='max-w-prose'>
      <div className="flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Review Auto-Drafted Note</h1>
      </div>
      {audioUrl ? (
      <audio className="w-full" controls>
        <source type="audio/mp3" src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
    ) :
        <div className="w-full">
        Loading audio
      </div>
    }

        <div tabIndex={0} className="collapse collapse-plus  mb-4">
        <div className="collapse-title text-lg font-medium">
          Audio Memo Transcript
        </div>
        <div className="collapse-content"> 
          <p>
            {appointment?.audio_transcript}
          </p>
        </div>
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
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
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
              value={patientName || ''}
              onChange={(e) => setPatientName(e.target.value)}
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
              value={patientDateOfBirth}
              onChange={(e) => setPatientDateOfBirth(e.target.value)}
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
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={allergies || ''}
              onChange={(e) => setAllergies(e.target.value)}
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
              // if checked, value is true. if unchecked, value is false
              onChange={(e) => setConsent(e.target.value)}
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
          value={chiefComplaint || ''}
          onChange={(e) => setChiefComplaint(e.target.value)}
        >
        </input>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="subjective" className="mb-2 block text-sm font-medium">
          Subjective
        </label>
        <div className="relative">
          <textarea
          id="subjective"
          name="subjective"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          value={subjective || ''}
          onChange={(e) => setSubjective(e.target.value)}
        >
        </textarea>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="objective" className="mb-2 block text-sm font-medium">
          Objective
        </label>
        <div className="relative">
          <textarea
          id="objective"
          name="objective"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          value={objective || ''}
          onChange={(e) => setObjective(e.target.value)}
        >
        </textarea>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="assessment" className="mb-2 block text-sm font-medium">
          Assessment
        </label>
        <div className="relative">
          <textarea
          id="assessment"
          name="assessment"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          value={assessment || ''}
          onChange={(e) => setAssessment(e.target.value)}
        >
        </textarea>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="plan" className="mb-2 block text-sm font-medium">
          Plan
        </label>
        <div className="relative">
          <textarea
          id="plan"
          name="plan"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          value={plan || ''}
          onChange={(e) => setPlan(e.target.value)}
        >
        </textarea>
      </div>
      </div>
        

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/appointments"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" active={submitOkay}>Add Appointment</Button>
      </div>
      </div>
    </form>
    


  )
}

export default CreateAppointmentPrefilled