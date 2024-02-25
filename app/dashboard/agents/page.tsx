import { Metadata } from 'next';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { PencilIcon, PlusIcon, TrashIcon, ArrowRightIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import AgentCard from '@/app/ui/agents/agent-card';


export const metadata: Metadata = {
  title: "Agents",
}
 
export default function Page() {


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>AI Agents</h1>
      </div>
      <div className="h-10 mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className='text-gray-700'>Create and manage AI-powered agents to send reminders or perform research.</div>
        <Link
      href="/dashboard/agents/create"
      className="flex h-10 ml-4 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      
    >
      <span className="hidden md:block">Create Agent</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
      </div>
      <AgentCard underlineText="Email me" normalText="a weekly newsletter with the latest research on embryo testing."/>
      <AgentCard underlineText="Text me" normalText="a daily reminder at 1pm to take 1 tsp omega-3 after lunch."/>
      <AgentCard underlineText="Update my podcast playlist" normalText="when new episodes are published related to Lyme disease protocols."/>
    </div>
  )
}