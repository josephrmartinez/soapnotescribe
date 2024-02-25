import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { PreparationModule } from '@/app/ui/prepare/PreparationModule';
import ResourceSearch from '@/app/ui/resources/ResourceSearch';

export const metadata: Metadata = {
  title: "Prepare",
}
 
export default function Page() {
  
  return (
    <div className="w-full">
      
        <div className="flex w-full items-center justify-between">
          <h1 className={`${GeistSans.className} text-2xl`}>Prepare for Upcoming Appointments</h1>
        </div>

        <div className="h-10 mt-4 flex items-center justify-between gap-2 md:mt-8">
          <div className='text-gray-700'>Fill out any of the fields below for help with generating questions to ask at your next appointment:</div>
        </div>
        
        <PreparationModule />
        
        
    </div>
  );
}