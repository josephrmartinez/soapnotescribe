'use client'

import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import Search from '@/app/ui/search';
import Exa from 'exa-js';
import React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

// export const metadata: Metadata = {
//   title: "Resources",
// }


const exa = new Exa("4ed3c884-65b6-4ecd-bc46-8ec854a15671"); 

export default function Page() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toString()

  

  async function exaSearch(){
    const autoPromptedResults = await exa.search(`${searchQuery}`, { useAutoprompt: true, numResults: 5 });
    console.log("results", autoPromptedResults)

  }


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>Resources</h1>
      </div>
      <div className="mt-4 mb-8 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Use one of the prompts below or type your own query..." />
        <button
          className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={exaSearch}
        >
          <span className="hidden md:block">Search</span>{' '}
          {/* <PlusIcon className="h-5 md:ml-4" /> */}
        </button>
      </div>

      <div className='grid grid-cols-4 gap-6'>
        <div className='grid gap-4'>
          <div>Companies</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>companies working on embryo testing</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>startups focused on longevity</div>

        </div>

        <div className='grid gap-4'>
          <div>Communities</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>groups focused on fertility issues</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>support groups for couples going through IVF</div>

        </div>

        <div className='grid gap-4'>
          <div>Research</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>latest research on fertility treatments</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>embryo testing breakthroughs</div>

        </div>

        <div className='grid gap-4'>
          <div>Clinics</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>clinics offering latest fertility treatments</div>
          <div className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'>international fertility clinics</div>

        </div>


      </div>


    </div>
  )
}