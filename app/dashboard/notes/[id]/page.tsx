// import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById, getSignedAudioUrl } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { formatDateToLocal } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: "Appointment Detail",
}
 

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)
    console.log("appointment data from appointments/[id]:", appointment)
    
    // Get audio url for media player:
    const audioUrl = appointment.audio_storage_url ? await getSignedAudioUrl(appointment.user_id, appointment.audio_storage_url) : undefined

    const appointmentDate = formatDateToLocal(appointment.appointment_date)

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'SOAP Notes', href: '/dashboard/notes' },
          {
            label: `${appointmentDate} with ${appointment.patient_name}`,
            href: `/dashboard/notes/${id}`,
            active: true,
          },
        ]}
      />
      
      
      <div className='max-w-prose'>
        <div className="flex w-full items-center justify-between">
          <h1 className={` text-2xl`}>Approved SOAP Note</h1>
        </div>
      

        

      <div className="rounded-md bg-gray-50 p-4 max-w-prose">
        
        <div className='grid grid-cols-2 gap-8'>

        {/* Appointment Date */}
        <div className="mb-4">
          <label htmlFor="appointment_date" className="mb-2 block text-sm font-medium">
            Appointment Date
          </label>
          <div
              id="appointment_date"
              className="py-2 px-2 text-sm"
            >
              {appointmentDate}
            </div>
          </div>


        {/* Appointment Time */}
        <div className="mb-4">
          <label htmlFor="appointment_time" className="mb-2 block text-sm font-medium">
            Appointment Time
          </label>
          <div className="relative">
            <div
              id="appointment_time"
              className="py-2 px-2 text-sm"            >
              {appointment.appointment_time}
            </div>
          </div>
      </div>

        </div>
      
      <div className='grid grid-cols-2 gap-8'>
      <div className="mb-4">
           <label htmlFor="patient" className="mb-2 block text-sm font-medium">
             Patient Name
           </label>
           <div className="relative">
             <div
              id="patient"
              className="py-2 px-2 text-sm"              
            >
              {appointment.patient_name}
            </div>
            {/* <UserCircleIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
          </div>
          
        </div>
        {/* Patient Date of Birth */}
        <div className="mb-4">
          <label htmlFor="appointment_date" className="mb-2 block text-sm font-medium">
            Patient Date of Birth
          </label>
          <div className="relative">
            <div
              id="patient_dob"
              className="py-2 px-2 text-sm"            >
              {appointment.patient_date_of_birth}
            </div>
          </div>
        </div>
      </div>


      <div className='grid grid-cols-2 gap-8'>
      <div className="mb-4">
           <label htmlFor="allergies" className="mb-2 block text-sm font-medium">
             Allergies
           </label>
           <div className="relative">
             <div
              className="py-2 px-2 text-sm">
              {appointment.allergies}
            </div>
          </div>
          
        </div>
        {/* Telemedicine Consent */}
        <div className="mb-4">
          <label htmlFor="consent" className="mb-2 block text-sm font-medium">
            Telemedicine Consent
          </label>
          <div className="py-2 px-2 text-sm">Patient is located in Arizona and consents to treatment.</div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
          Chief Complaint
        </label>
        <div className="relative">
          <div
          id="complaint"
          className="py-2 px-2 text-sm">
          {appointment.chief_complaint}
        </div>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="subjective" className="mb-2 block text-sm font-medium">
          Subjective
        </label>
        <div className="relative">
          <div
          id="subjective"
          className="py-2 px-2 text-sm">
          {appointment.soap_subjective}
        </div>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="objective" className="mb-2 block text-sm font-medium">
          Objective
        </label>
        <div className="relative">
          <div
          id="objective"
          className="py-2 px-2 text-sm">
          {appointment.soap_objective || ''}
        </div>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="assessment" className="mb-2 block text-sm font-medium">
          Assessment
        </label>
        <div className="relative">
          <div
          id="assessment"
          className="py-2 px-2 text-sm">
          {appointment.soap_assessment || ''}
        </div>
      </div>
      </div>

      <div className="mb-4">
        <label htmlFor="plan" className="mb-2 block text-sm font-medium">
          Plan
        </label>
        <div className="relative">
          <div
          id="plan"
          className="py-2 px-2 text-sm">
          {appointment.soap_plan || ''}
        </div>
      </div>
      </div>
      <div className="mb-4">
           <label htmlFor="doctorsignature" className="mb-2 block text-sm font-medium">
             Doctor Signature
           </label>
           <div className="relative">
             <div
              id="doctor_signature"
              className="py-2 px-2 text-sm">
              {appointment.doctor_signature || ''}
            </div>
          </div>
          

        

        </div>

        <div className="collapse-title text-lg font-medium">Audio Memo</div>
        {audioUrl ? (
      <audio className="w-full mb-6" controls>
        <source type="audio/mp3" src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
    ) :
        <div className="w-full">
        Loading audio
      </div>
    }
    <div tabIndex={0} className="collapse collapse-plus border mb-4">
        <div className="collapse-title text-lg font-medium">
          Audio Memo Transcript
        </div>
        <div className="collapse-content"> 
          <p>
            {appointment?.audio_transcript}
          </p>
        </div>
      </div>
      
      </div>
      </div>
      
    </main>
  );
}
