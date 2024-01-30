import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';


export const metadata: Metadata = {
  title: "Prepare",
}
 
export default async function Page() {


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>Prepare for Upcoming Appointments</h1>
      </div>
    </div>
  )
}