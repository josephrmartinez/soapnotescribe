import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import ResourceSearch from '@/app/ui/resources/ResourceSearch';
import AdvocateChat from '@/app/ui/advocatechat/advocatechat';
import AdvocateChatAppointmentsTable from '@/app/ui/advocatechat/appointmentstable';

export const metadata: Metadata = {
  title: "Advocate Chat",
}

export default function Page() {

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>Advocate Chat</h1>
      </div>
      <div className="h-10 mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className='text-gray-700'>An AI medical advocate that uses information from your medical appointment recordings to provide answers relevant to your specific situation.</div>
      </div>
      <AdvocateChat appointmentHistory='summaries from all appointments' />
        

    </div>
  )
}

