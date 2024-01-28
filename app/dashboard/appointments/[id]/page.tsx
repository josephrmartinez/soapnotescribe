import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById, getSignedAudioUrl } from '@/app/lib/data';
import { UpdateAppointment } from '@/app/ui/appointments/buttons';
import { notFound } from 'next/navigation';
import { CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import AIChatInput from '@/app/ui/appointments/aichatinput';
import AIContent from '@/app/ui/appointments/AIcontent';
import AIChat from '@/app/ui/appointments/aichat';




export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)
    console.log("appointment data:", appointment)

    if (!appointment) {
      notFound();
    }
    
    // Get audio url for media player:
    const audioUrl = await getSignedAudioUrl(appointment.patient, appointment.audio_url)


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
        <div className='flex flex-row w-full justify-between'>
        <div className='flex flex-row items-center mb-6'>
            <CalendarDaysIcon width={28}/>
            <div className='font-semibold text-gray-700 ml-2'>{displayDate}</div>
        </div>
        <div className='flex flex-row items-center mb-6'>
            <BuildingOffice2Icon width={28}/>
            <div className='font-semibold text-gray-700 ml-2'>{appointment.clinic}</div>
        </div>

        <UpdateAppointment id={appointment.id}/>
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
                  <AIContent transcript={appointment.transcript} summary={appointment.summary} feedback={appointment.feedback}/>
              </div>
          </div>

          <div>
            <div className="grid grid-cols-5 mb-4">
              <div className={`ml-2 text-lg font-semibold  mt-2 text-gray-700 `}>
                AI Chat
              </div>
            </div>
            <AIChat transcript={["yee"]}/>
            {/* <div className='border rounded-lg h-80 bg-white mb-4'></div>
            <AIChatInput placeholder='Ask question about appointment...'/> */}
          </div>
        </div>
    </main>
  );
}