import clsx from 'clsx';


export function SearchSuggestion({text, searchFunction }: {text: string, searchFunction: Function}) {
  return (
    <button
    className='border rounded-lg p-2 cursor-pointer hover:bg-gray-100'
    onClick={()=> searchFunction(text)}>
      {text}
    </button>
  );
}


