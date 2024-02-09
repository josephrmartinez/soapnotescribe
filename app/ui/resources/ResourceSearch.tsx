'use client'

import Search from '@/app/ui/search';
import React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchSuggestion } from '@/app/ui/resources/SearchSuggestion';


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

export default function ResourceSearch() {
  const [searchResult, setSearchResult] = useState<SearchResponse>({
    autopromptString: "",
    results: [],
  });
  const [suggestionsVisible, setSuggestionsVisible] = useState(true)
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toString()


  async function exaSearch(){
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: searchQuery }),
      });

      const data = await response.json();
      const { output } = data;
      if (output ) {
        console.log("handleSearch output:", output);
        setSuggestionsVisible(false)
        setSearchResult(output)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  }

  async function handleSearch(text: string){
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      const data = await response.json();
      const { output } = data;
      if (output ) {
        console.log("handleSearch output:", output);
        setSuggestionsVisible(false)
        setSearchResult(output)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  }

  
  return (
    <div>
      
      
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
          <SearchSuggestion text="companies working on embryo testing" searchFunction={handleSearch} />
          <SearchSuggestion text="startups focused on longevity" searchFunction={handleSearch} />
        </div>

        <div className='grid gap-4'>
          <div>Communities</div>
          <SearchSuggestion text="groups focused on fertility issues" searchFunction={handleSearch} />
          <SearchSuggestion text="support groups for couples going through IVF" searchFunction={handleSearch} />
        </div>

        <div className='grid gap-4'>
          <div>Research</div>
          <SearchSuggestion text="latest research on fertility treatments" searchFunction={handleSearch} />
          <SearchSuggestion text="embryo testing breakthroughs" searchFunction={handleSearch} />
        </div>

        <div className='grid gap-4'>
          <div>Clinics</div>
          <SearchSuggestion text="clinics offering latest fertility treatments" searchFunction={handleSearch} />
          <SearchSuggestion text="international fertility clinics" searchFunction={handleSearch} />
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