'use client'

import Search from '@/app/ui/search';
import React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchSuggestion } from './SearchSuggestion';
import { ArrowLeft } from '@phosphor-icons/react';


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

const SearchSuggester: React.FC<{ searches: string[] }> = ({ searches }) => {
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
      
      
      <div className="mb-8 flex items-center justify-between gap-2">
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
      <>
      <div className='w-full mx-auto grid gap-4'>
        <div className='text-gray-600 font-semibold text-center'>Search Suggestions:</div>
        {searches.map((query, index) => (
            <div key={index}>
            <SearchSuggestion text={query} searchFunction={handleSearch} />
            </div>
                ) 
            )  
        }
        </div>
        </>
    }
        

      {!suggestionsVisible && 
      <>
      
      <div className='flex flex-row items-center mb-4 cursor-pointer hover:text-teal-700 transition-all'
        onClick={()=>setSuggestionsVisible(true)}>
        <ArrowLeft size={24}/> 
        <div className='ml-2 font-semibold text-gray-600 hover:text-teal-700 transition-all'>back to search suggestions</div>
      </div>
      <div className='w-full mx-auto'>
      {searchResult.results.map((result) => (
        <div key={result.id} className='flex flex-col border rounded-lg p-2 my-2'>
          <div className='font-semibold text-gray-700'>{result.title}</div>
          <a href={result.url} target='_blank' className='text-blue-700 truncate'>{result.url}</a>
        </div>
      ))}
      </div>
      </>
      }

    </div>
  )
}

export default SearchSuggester