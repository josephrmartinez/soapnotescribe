import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';


export const metadata: Metadata = {
  title: "Account Settings",
}
 
export default async function Page() {


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>Account Settings</h1>
      </div>
    </div>
  )
}