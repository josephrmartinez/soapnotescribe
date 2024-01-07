'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


export default function AIChatInput({ placeholder }: { placeholder: string }) {
  
  
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
      />
      
      <PaperAirplaneIcon className="absolute right-3 top-1/2 h-[22px] w-[22px] -translate-y-1/2 text-gray-700  peer-focus:text-teal-600" />
    </div>
  );
}
