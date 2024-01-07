import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById } from '@/app/lib/data';
import { UpdateAppointment } from '@/app/ui/appointments/buttons';
import { notFound } from 'next/navigation';
import { CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import Search from '@/app/ui/search';
import IncrementCounter from '@/app/ui/appointments/counter';
import AIContent from '@/app/ui/appointments/AIcontent';




export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)

    if (!appointment) {
      notFound();
    }
    
    // Format date obj:
    var inputString = new Date(appointment.appointment_date);
    var dateObject = new Date(inputString);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var displayDate = dateObject.toLocaleDateString('en-US', options);


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

      <div className='flex flex-row items-center'>
        <div className='font-semibold mr-2'>Amount Paid:</div>
        <div>${appointment.amount}</div>
      </div>
      <audio className="w-full my-4" controls>
        <source  type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
        </div>



        <div className='grid grid-cols-2 gap-4'>
            <div>
                <div className='max-w-prose'>
                    <AIContent />
                </div>
            </div>

            <div>
            <div className="grid grid-cols-5 mb-4">
            
            
            <div className={`ml-2 text-lg font-semibold  mt-2 text-gray-700 `}
                >AI Chat</div>
            
            </div>
                <div className='border rounded-lg h-96 bg-white mb-2'></div>
                <Search placeholder='Ask question about appointment...'/>
            </div>
        </div>
      

      
      
      
    </main>
  );
}