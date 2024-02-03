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

interface SearchResult {
  title: string;
  url: string;
  publishedDate: string;
  author: string | null;
  id: string;
  score: number;
}

interface SearchResponse {
  autopromptString: string;
  results: SearchResult[];
}

export default function Page() {
  const [searchResult, setSearchResult] = useState<SearchResponse>({
    autopromptString: "",
    results: [],
  });
  const [suggestionsVisible, setSuggestionsVisible] = useState(true)
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toString()


  async function exaSearch(){
    setSuggestionsVisible(false)
    try {
      const autoPromptedResults = await exa.search(`${searchQuery}`, {
        useAutoprompt: true,
        numResults: 5, 
      }) as SearchResponse

      if (autoPromptedResults && autoPromptedResults.results) {
        setSearchResult(autoPromptedResults);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // const searchResult =
  //   {
  //     "autopromptString": "Here is a company working on embryo testing innovation:",
  //     "results": [
  //         {
  //             "title": "Orchid Embryo Report: Identify your healthiest embryo",
  //             "url": "https://www.orchidhealth.com/",
  //             "publishedDate": "2000-01-01",
  //             "author": null,
  //             "id": "aYZr0UKugxRCk6PuslVx3A",
  //             "score": 0.22058936953544617
  //         },
  //         {
  //             "title": "Better TestsBetter Outcomes",
  //             "url": "https://www.lifeview.com/",
  //             "publishedDate": "2023-01-01",
  //             "author": "Simon Fishel",
  //             "id": "VQKsiSrmLFt0KztH4UAFNQ",
  //             "score": 0.21682754158973694
  //         },
  //         {
  //             "title": "Inherent Biosciences",
  //             "url": "https://www.inherentbio.com/",
  //             "publishedDate": "2023-01-01",
  //             "author": null,
  //             "id": "V4DNxsDh-Q3BYrCk-6BZfg",
  //             "score": 0.21519741415977478
  //         },
  //         {
  //             "title": "Home",
  //             "url": "https://www.emgenisys.co/",
  //             "publishedDate": "2023-01-01",
  //             "author": null,
  //             "id": "TfmpG9WYYgBmP-LMa6qiXA",
  //             "score": 0.21410804986953735
  //         },
  //         {
  //             "title": "Ravata",
  //             "url": "https://www.ravatasolutions.com/",
  //             "publishedDate": "2006-01-01",
  //             "author": null,
  //             "id": "dmXCZMVNL_jImgCxP38eTA",
  //             "score": 0.21378853917121887
  //         }
  //     ]
  // }

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

      {suggestionsVisible && 
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
      }

      {!suggestionsVisible && 
      <div className='w-4/5 mx-auto'>
      {searchResult.results.map((result) => (
        <div key={result.id} className='flex flex-col border p-2 my-2'>
          <div className='font-semibold text-gray-800'>{result.title}</div>
          <a href={result.url} className='text-blue-700'>{result.url}</a>
        </div>
      ))}
      </div>
      }

    </div>
  )
}