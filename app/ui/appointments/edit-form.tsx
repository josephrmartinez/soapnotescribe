'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database } from '@/app/database.types'
// import { Appointment } from '@/app/lib/definitions';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/app/ui/button';
import {
    CheckIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    UserCircleIcon, PencilSquareIcon
  } from '@heroicons/react/24/outline';
import AudioUpload from '@/app/dashboard/appointments/create/AudioUpload';
import getTranscript from '@/app/lib/actions';


// interface Appointment {
//     audio_url: string | null;
//     clinic: string | null;
//     combined_text: string | null;
//     created_at: string;
//     date: string;
//     description: string | null;
//     feedback: string;
//     id: string;
//     title: string | null;
//     provider: string | null;
//     transcript: JSON;
//     summary: string;
// }

export default function EditAppointment({ session, appointment }: { session: Session | null, appointment: Database['public']['Tables']['appointments']['Row'] }) {
  
  const [title, setTitle] = useState<string | null>(appointment.title || null)
  const [description, setDescription] = useState<string | null>(appointment.description || null)
  const [provider, setProvider] = useState<string | null>(appointment.provider || null)
  const [clinic, setClinic] = useState<string | null>(appointment.clinic || null)
  const [date, setDate] = useState<string | undefined>(appointment.date || undefined)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(appointment.audio_url || null)
  const [tempDownloadUrl, setTempDownloadUrl] = useState<string | null>(appointment.audio_url || null)
  
  const [loading, setLoading] = useState(true)
  const [submitOkay, setSubmitOkay] = useState<boolean>(true)
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const user = session?.user
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  

  
function submitAppointment(){
    return
    
}


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
    <form onSubmit={submitAppointment}>
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
          href={`/dashboard/appointments/${appointment.id}`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" active={!isUploading}>Update Appointment</Button>
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

// 'use client';

// import { AppointmentForm } from '@/app/lib/definitions';
// import {
//   PencilSquareIcon,
//   BuildingOffice2Icon,
//   CalendarDaysIcon,
//   CurrencyDollarIcon,
//   UserCircleIcon,
// } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { Button } from '@/app/ui/button';
// import { updateAppointment } from '@/app/lib/actions';
// import { useFormState } from 'react-dom';
// import { DeleteAppointment } from './buttons';

// export default function EditAppointmentForm({
//   appointment
// }: {
//   appointment: AppointmentForm;
// }) {
//   const initialState = { message: null, errors: {} };
//   const updateAppointmentWithId = updateAppointment.bind(null, appointment.id);
//   const [state, dispatch] = useFormState(updateAppointmentWithId, initialState);

//   console.log("appointment:", appointment)

// function formatDateForInput(date: string): string {
//   const parsedDate = new Date(date);
//   const year = parsedDate.getFullYear();
//   const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
//   const day = String(parsedDate.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }


//   return (
//     <form action={dispatch}>
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Appointment Title */}
//         <div className="mb-4">
//           <label htmlFor="title" className="mb-2 block text-sm font-medium">
//             Appointment Title
//           </label>
//           <div className="relative">
//             <input
//               id="title"
//               name="title"
//               type='text'
//               placeholder='Appointment name'
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={appointment.title}
//               aria-describedby='title-error'
//             >
              
//             </input>
//             <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           <div id="title-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.title &&
//               state.errors.title.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </div>
        
//         {/* Description */}
//         <div className="mb-4">
//           <label htmlFor="description" className="mb-2 block text-sm font-medium">
//             Appointment Description
//           </label>
//           <div className="relative">
//             <input
//               id="description"
//               name="description"
//               placeholder='Brief description of appointment'
//               type='text'
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={appointment.description}
//               aria-describedby='description-error'
//             >
              
//             </input>
//             <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           <div id="description-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.description &&
//               state.errors.description.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </div>

//         {/* Provider */}
//         <div className="mb-4">
//           <label htmlFor="provider" className="mb-2 block text-sm font-medium">
//             Provider
//           </label>
//           <div className="relative">
//             <input
//               id="provider"
//               name="provider"
//               placeholder='Doctor or name of provider(s) seen during visit'
//               type='text'
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={appointment.provider}
//               aria-describedby='provider-error'
//             >
              
//             </input>
//             <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           <div id="provider-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.provider &&
//               state.errors.provider.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </div>

//         {/* Clinic */}
//         <div className="mb-4">
//           <label htmlFor="clinic" className="mb-2 block text-sm font-medium">
//             Clinic
//           </label>
//           <div className="relative">
//             <input
//               id="clinic"
//               name="clinic"
//               placeholder='Clinic, facility name'
//               type='text'
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={appointment.clinic}
//               aria-describedby='clinic-error'
//             >
              
//             </input>
//             <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           <div id="clinic-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.clinic &&
//               state.errors.clinic.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </div>


//         {/* Date */}
//         <div className="mb-4">
//           <label htmlFor="appointment_date" className="mb-2 block text-sm font-medium">
//             Appointment Date
//           </label>
//           <div className="relative">
//             <input
//               id="appointment_date"
//               name="appointment_date"
//               type="date"
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={formatDateForInput(appointment.appointment_date)}
//               aria-describedby='date-error'
//             >
              
//             </input>
//             <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           <div id="date-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.appointment_date &&
//               state.errors.appointment_date.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </div>


        

//         {/* Amount Paid */}
//         <div className="mb-4">
//           <label htmlFor="amount" className="mb-2 block text-sm font-medium">
//             Amount Paid
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               <input
//                 id="amount"
//                 name="amount"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 placeholder="Enter USD amount"
//                 defaultValue={appointment.amount}
//                 className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 aria-describedby='amount-error'
//               />
//               <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>
//           <div id="amount-error" aria-live="polite" aria-atomic="true">
//         {state.errors?.amount &&
//           state.errors.amount.map((error: string) => (
//             <p className="mt-2 text-sm text-red-500" key={error}>
//               {error}
//             </p>
//           ))}
//         </div>  
//         </div>
        

//         {/* Appointment Recording */}
//         <fieldset>
//           <legend className="mb-2 block text-sm font-medium">
//             Appointment Recording
//           </legend>
//           <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
//             <div className="flex gap-4">
//               <div className="flex items-center">
              
//                 <input
//                   id="audio_path"
//                   name="audio_path"
//                   aria-describedby='audio-error'
//                   type="file"
//                   // defaultValue={appointment.audio_path}
//                   accept="audio/mpeg, audio/mp3"
//                   className="cursor-pointer text-sm border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
//                 />
                
//               </div>
              
//             </div>
//           </div>
          
//         </fieldset>
        


//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/appointments"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <DeleteAppointment id={appointment.id} />
//         <Button type="submit">Update Appointment</Button>
//       </div>
//     </form>
//   );
// }
