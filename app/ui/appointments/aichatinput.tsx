import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

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
      
      <button className='border w-12 h-12 flex flex-col items-center rounded-lg bg-teal-700 hover:bg-teal-600 active:bg-teal-500 transition-colors ml-2'>
        <PaperAirplaneIcon className="h-[22px] w-[22px] translate-y-1/2 text-gray-50 " />
      </button>
      
      
    </div>
  );
}