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
      
      
        
      <div className='grid grid-cols-2 gap-8 min-h-[96rem]'>
      
      <div>
      <div>
        <div className="collapse-title text-xl font-medium">
          Audio Memo
        </div>
        <audio className="w-full mb-8" controls>
          <source type="audio/mp3" src={audioUrl} />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-200">
        <div className="collapse-title text-lg font-medium">
          Audio Memo Transcript
        </div>
        <div className="collapse-content"> 
          <p>
            Okay, so the next patient was seen on 2-24-2024. The patient's name is Therese Boshart. That's spelled B as in boy, O-S-S as in Sam, H-A-R-D as in dog, T as in Tom. Time seen, 14-31. Chief complaint, travel abroad. Her date of birth is January 21st, 1959. And her S is, Therese is a however-year-old female who calls today requesting a travel pack of medications to take with her to Thailand. She will be traveling to Thailand and staying there for approximately one month and is concerned that she may contract certain bacterial illnesses that could be potentially treatable with antibiotics and medications from the United States. Therefore, she is requesting a travel pack of medications, which I have agreed to provide for her period. She has been immunized as a child and was going to obtain specific immunizations for this travel across country but has decided not to period. She currently has no symptoms at the point of this encounter period. Her O is based on her age and the area that she's traveling to. I will prescribe the most common medications to treat the most common ailments while traveling period. Prophylactic travel pack. And the prescriptions are Cipro 500 milligrams, 1 POBID for 10 days, dispense 20. Flagyl 500 milligrams, 1 POBID for 10 days, dispense 20. Z-Pak dispense as directed one Zofran four milligram ODT she used to take one Q8 hours pure in nausea or vomiting the next prescription is Keflex 500 milligrams one TID for 10 days dispense 30 30. And the last prescription is Travalon, which is spelled T-R-A-V as in Victor, E-L-A-R-N. This is an over-the-counter supplement medication that I advised her to buy on Amazon, which is essentially a probiotic that binds to certain bacteria and viruses that are ingested in the GI tract to prevent traveler's diarrhea and or parasites, period. And then new paragraph, I discussed with the patient that part of our travel executive pack provides our ongoing advisement services period should she end up ill in Thailand she used to call or text she used to call text or email me her symptoms and I will advise her on which of the above medications to initiate, period. That's done.
          </p>
        </div>
      </div>

      </div>
      
      <div className='max-w-prose'>
                      
        <div className="my-4 text-xl font-medium">
          SOAP Note
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
          
          
        </div>
      </div>
    </main>
  );
}

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