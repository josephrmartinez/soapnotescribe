'use client'
import { useCallback, useEffect, useState } from 'react'
import { GeistSans } from 'geist/font/sans';
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
import AudioUpload from './AudioUpload';
import getTranscript from '@/app/lib/actions';


export default function CreateAppointment({ session }: { session: Session | null }) {
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

  

  const submitAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
        setLoading(true)

        const { error, data } = await supabase.from('appointments').insert({
            patient: user?.id as string,
            created_at: new Date().toISOString(),
            title,
            description,
            provider,
            clinic,
            date,
            audio_url: recordingUrl,
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
        <h1 className={`${GeistSans.className} text-2xl`}>Create SOAP note</h1>
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Appointment Recording */}
        <AudioUpload 
            session={session} 
            setRecordingUrl={setRecordingUrl} 
            setTempDownloadUrl={setTempDownloadUrl}
            isUploading = {isUploading}
            setIsUploading={setIsUploading} />  
        

        {/* Appointment Title */}
        <div className="my-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Appointment Title
          </label>
          <div className="relative">
            <input
              id="title"
              name="title"
              type='text'
              placeholder='Appointment name'
              required
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
            >
              
            </input>
            <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Appointment Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              required
              placeholder='Brief description of appointment'
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              
              aria-describedby='description-error'
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
            >
              
            </input>
            <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
        </div>

        {/* Provider */}
        <div className="mb-4">
          <label htmlFor="provider" className="mb-2 block text-sm font-medium">
            Provider
          </label>
          <div className="relative">
            <input
              id="provider"
              name="provider"
              required
              placeholder='Doctor or name of provider(s) seen during visit'
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={provider || ''}
              onChange={(e) => setProvider(e.target.value)}
              aria-describedby='provider-error'
            >
              
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
        </div>

        {/* Clinic */}
        <div className="mb-4">
          <label htmlFor="clinic" className="mb-2 block text-sm font-medium">
            Clinic
          </label>
          <div className="relative">
            <input
              id="clinic"
              name="clinic"
              required
              placeholder='Clinic, facility name'
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={clinic || ''}
              onChange={(e) => setClinic(e.target.value)}
              aria-describedby='clinic-error'
            >
              
            </input>
            <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
        </div>

        {/* Date */}
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
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            >
              
            </input>
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
        </div>

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
    </form>
  )
}

  
  


//   const getProfile = useCallback(async () => {
//     try {
//       setLoading(true)

//       const { data, error, status } = await supabase
//         .from('profiles')
//         .select(`full_name, username, website, avatar_url`)
//         .eq('id', user?.id)
//         .single()

//       if (error && status !== 406) {
//         throw error
//       }

//       if (data) {
//         setFullname(data.full_name)
//         setUsername(data.username)
//         setWebsite(data.website)
//         setAvatarUrl(data.avatar_url)
//       }
//     } catch (error) {
//       alert('Error loading user data!')
//     } finally {
//       setLoading(false)
//     }
//   }, [user, supabase])

//   useEffect(() => {
//     getProfile()
//   }, [user, getProfile])

//   async function updateProfile({
//     username,
//     website,
//     avatar_url,
//   }: {
//     username: string | null
//     fullname: string | null
//     website: string | null
//     avatar_url: string | null
//   }) {
//     try {
//       setLoading(true)

//       const { error } = await supabase.from('profiles').upsert({
//         id: user?.id as string,
//         full_name: fullname,
//         username,
//         website,
//         avatar_url,
//         updated_at: new Date().toISOString(),
//       })
//       if (error) throw error
//       alert('Profile updated!')
//     } catch (error) {
//       alert('Error updating the data!')
//     } finally {
//       setLoading(false)
//     }
//   }