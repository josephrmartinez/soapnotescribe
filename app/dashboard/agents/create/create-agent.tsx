'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database } from '@/app/database.types'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/app/ui/button';
import {
    CheckIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    UserCircleIcon, PencilSquareIcon
  } from '@heroicons/react/24/outline';
// import AudioUpload from './AudioUpload';
import getTranscript from '@/app/lib/actions';


export default function CreateAgent({ session }: { session: Session | null }) {
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
  const user = session?.user
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [prediction, setPrediction] = useState(null)

  const [agentDescription, setAgentDescription] = useState<string>('')
  const [agentType, setAgentType] = useState<string>('')
  const [reminderType, setReminderType] = useState<string>('')
  const [researchType, setResearchType] = useState<string>('')
  const [frequency, setFrequency] = useState<string>('')
  const [todo, setTodo] = useState<string>('')

  

//   const submitAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//         setLoading(true)

//         const { error, data } = await supabase.from('appointments').insert({
//             patient: user?.id as string,
//             created_at: new Date().toISOString(),
//             title,
//             description,
//             provider,
//             clinic,
//             date,
//             audio_url: recordingUrl,
//             temp_audio_url: tempDownloadUrl,
//           })
//           .select();
    
//           if (error) throw error
//           tempDownloadUrl && getTranscript(tempDownloadUrl, data[0].id)
//           router.push('/dashboard/appointments');
//         } catch (error) {
//           console.error('Error creating the appointment:', error);
//         } finally {
//           setLoading(false);
          
//         }
//       };


  return (
    <div className="grid grid-cols-3">
      <div className="">
        
        <div className="my-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Type of Agent
          </label>
          <div className="relative">
            <select
              id="agentType"
              name="agentType"
              required
              className="peer block w-60 cursor-pointer rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
              value={agentType}
              onChange={(e) => setAgentType(e.target.value)}
            >
                <option value="">Select Agent Type</option>
                <option value="reminder">Reminder</option>
                <option value="research">Research</option>
            </select>
          </div>
        </div>
        
        {agentType === 'reminder' && (
        
        <div className="my-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Type of Reminder
          </label>
          <div className="relative">
            <select
              id="reminderType"
              name="reminderType"
              required
              className="peer block w-60 cursor-pointer rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
              value={reminderType}
              onChange={(e) => setReminderType(e.target.value)}
            >
                <option value="">Select Reminder Type</option>
                <option value="text">Text message</option>
                <option value="email">email</option>
            </select>
          </div>
        </div>
        )}

        {agentType === 'research' && (
        
        <div className="my-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Research Output
          </label>
          <div className="relative">
          <select
              id="researchType"
              name="researchType"
              required
              className="peer block w-60 cursor-pointer rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
              value={researchType}
              onChange={(e) => setResearchType(e.target.value)}
            >
                <option value="">Select Research Type</option>
                <option value="newsletter">email newsletter</option>
                <option value="podcasts">podcast playlist</option>
                <option value="videos">video playlist</option>
            </select>
            
          </div>
        </div>
        )}

        {(reminderType !=='' || researchType !== '') && (
        
        <div className="my-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Frequency
          </label>
          <div className="relative">
          <select
              id="frequency"
              name="frequency"
              required
              className="peer block w-60 cursor-pointer rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
                <option value="">Select Frequency</option>
                <option value="newsletter">daily</option>
                <option value="podcasts">weekly</option>
                <option value="videos">monthly</option>
            </select>
          </div>
        </div>
        )}


      </div>
      <div className="col-span-2 mt-6 flex flex-col gap-4">
        <div className='text-4xl font-semibold h-80'>Text me a reminder to take 1 tsp of fish oil every Tuesday at 3pm.</div>
        <div className="mt-6 flex justify-start gap-4">
            <Link
            href="/dashboard/agents"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
            Cancel
            </Link>
            <Button type="submit" active={!isUploading}>Create Agent</Button>
        </div>
      </div>
    </div>
  )
}




