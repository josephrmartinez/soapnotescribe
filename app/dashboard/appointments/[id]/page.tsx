// import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById, getSignedAudioUrl } from '@/app/lib/data';
import { UpdateAppointment, AddDocsToAppointment, ShareAppointment } from '@/app/ui/appointments/buttons';
import { notFound } from 'next/navigation';
import { CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Appointment Detail",
}
 

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)
    console.log("appointment data:", appointment)

    // const transcriptString = JSON.stringify(appointment?.transcript);
    // // console.log("transcript", transcriptString)

    // if (!appointment) {
    //   notFound();
    // }

    // Format date obj:
    // var inputString = new Date(appointment.date);
    // var dateObject = new Date(inputString);
    // var displayDate = dateObject.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


    
    // Get audio url for media player:
    const audioUrl = appointment.audio_storage_url ? await getSignedAudioUrl(appointment.user_id, appointment.audio_storage_url) : undefined


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Appointments', href: '/dashboard/appointments' },
          {
            label: `SOAP note`,
            href: `/dashboard/appointments/${id}`,
            active: true,
          },
        ]}
      />
      
        <div>
        {/* <div className='grid grid-cols-3 w-full'>
          <div>
            <div className='flex flex-row items-center mb-6'>
                <CalendarDaysIcon width={28}/>
                <div className='font-semibold text-gray-700 ml-2'>{displayDate}</div>
            </div>
            <div className='flex flex-row items-center mb-6'>
                <BuildingOffice2Icon width={28}/>
                <div className='font-semibold text-gray-700 ml-2'>{appointment.clinic}</div>
            </div>
          </div>
          <div className='col-start-3 flex flex-row gap-3 justify-end'>
            <AddDocsToAppointment id={appointment.id}/>
            <UpdateAppointment id={appointment.id}/>
            <ShareAppointment id={appointment.id}/>
          </div>
        </div>
        
      <div className='flex flex-row items-center'>
        <div className='font-semibold mr-2'>Description:</div>
        <div>{appointment.description}</div>
      </div> */}

      
      <audio className="w-full my-4" controls>
        <source type="audio/mp3" src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
        </div>



        <div className='grid grid-cols-2 gap-4'>
          <div>
              <div className='max-w-prose'>
                  {/* <AIContent apptid={appointment.id} transcript={appointment.transcript} summary={appointment.summary} feedback={appointment.feedback}/> */}
              </div>
          </div>

          <div>
            
            
          </div>
        </div>
    </main>
  );
}