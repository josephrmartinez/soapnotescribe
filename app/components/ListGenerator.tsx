'use client';

import { useState, useEffect } from 'react';
import { updateUserSettings } from '../lib/data';

interface ListGeneratorProps {
  listName: string;
  defaultItem: string;
  listItems?: string[];
  fieldName: string;
  userId: string;
}

const ListGenerator: React.FC<ListGeneratorProps> = ({
  listName,
  listItems,
  defaultItem,
  fieldName,
  userId,
}) => {
  const [items, setItems] = useState<string[]>(listItems || []);
  const [defaultOption, setDefaultOption] = useState<string>(defaultItem);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const payload = {
      [fieldName]: items,
      [`${fieldName}_default`]: defaultOption,
    };

    updateUserSettings(payload, userId);
  }, [items, defaultOption]);

  function handleDeleteItem(index: number) {
    setItems((prevItems) => {
      const newItems = prevItems.filter((_, i) => i !== index);

      if (prevItems[index] === defaultOption) {
        setDefaultOption(newItems[0]);
      }

      return newItems;
    });
  }

  function handleAddItem() {
    const newItem = inputValue;
    if (items.includes(newItem)) {
      return;
    }
    setItems([...items, newItem]);
    setInputValue('');
  }

  function handleSetDefault(index: number) {
    setDefaultOption(items[index]);
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  }

  return (
    <div>
      <div className="mb-2 ml-2 text-lg font-semibold text-teal-700">
        {listName}
      </div>
      <ul className="ml-4 w-96">
        {items.map((item, index) => (
          <li
            key={index}
            className="grid grid-cols-3 items-center gap-6 border-b py-2 last-of-type:border-none"
          >
            <div className="font-semibold text-gray-700">{item}</div>
            <div>
              {item == defaultOption ? (
                <div className="whitespace-nowrap rounded-lg bg-gray-100 px-2 py-2  text-center text-sm font-semibold text-teal-800">
                  default
                </div>
              ) : (
                <div
                  className="cursor-pointer whitespace-nowrap rounded-lg px-2 py-2 text-center text-sm text-gray-800 transition-all hover:bg-gray-50 hover:text-teal-800"
                  onClick={() => handleSetDefault(index)}
                >
                  make default
                </div>
              )}
            </div>
            <div
              className="cursor-pointer text-center text-sm text-gray-800 transition-all hover:text-red-600"
              onClick={() => handleDeleteItem(index)}
            >
              delete
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <input
          type="text"
          className="my-2 ml-2 h-8 w-32 rounded border border-gray-400"
          placeholder={`+ add option`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleInputKeyDown(e)}
        ></input>
      </div>
    </div>
  );
};

export default ListGenerator;
