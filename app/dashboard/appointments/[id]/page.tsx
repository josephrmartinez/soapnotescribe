// import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById, getSignedAudioUrl } from '@/app/lib/data';
import { UpdateAppointment, AddDocsToAppointment } from '@/app/ui/appointments/buttons';
import { notFound } from 'next/navigation';
import { CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import AIContent from '@/app/ui/appointments/AIcontent';
import AIChat from '@/app/ui/appointments/aichat';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Appointment Detail",
}
 

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)
    // console.log("appointment data:", appointment)

    const transcriptString = JSON.stringify(appointment?.transcript);
    console.log("transcript", transcriptString)



    if (!appointment) {
      notFound();
    }
    
    // Get audio url for media player:
    
    const audioUrl = appointment.audio_url ? await getSignedAudioUrl(appointment.patient, appointment.audio_url) : undefined


    // Format date obj:
    var inputString = new Date(appointment.date);
    var dateObject = new Date(inputString);
    var displayDate = dateObject.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Appointments', href: '/dashboard/appointments' },
          {
            label: `${appointment.title} with ${appointment.provider}`,
            href: `/dashboard/appointments/${id}`,
            active: true,
          },
        ]}
      />
      
        <div>
        <div className='grid grid-cols-3 w-full'>
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
        <div className='col-start-3 flex flew row gap-3 justify-end'>
          <AddDocsToAppointment id={appointment.id}/>
          <UpdateAppointment id={appointment.id}/>
        </div>
        
      </div>
            

      <div className='flex flex-row items-center'>
        <div className='font-semibold mr-2'>Description:</div>
        <div>{appointment.description}</div>
      </div>

      
      <audio className="w-full my-4" controls>
        <source type="audio/mp3" src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
        </div>



        <div className='grid grid-cols-2 gap-4'>
          <div>
              <div className='max-w-prose'>
                  <AIContent apptid={appointment.id} transcript={appointment.transcript} summary={appointment.summary} feedback={appointment.feedback}/>
              </div>
          </div>

          <div>
            <div className="grid grid-cols-5 mb-4">
              <div className={`ml-2 text-lg font-semibold  mt-2 text-gray-700 `}>
                AI Chat
              </div>
            </div>
            <AIChat transcript={transcriptString}/>
            {/* <div className='border rounded-lg h-80 bg-white mb-4'></div>
            <AIChatInput placeholder='Ask question about appointment...'/> */}
          </div>
        </div>
    </main>
  );
}