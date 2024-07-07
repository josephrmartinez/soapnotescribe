'use client';

import { useState } from 'react';

interface ListItem {
  id: number;
  name: string;
  default: boolean;
}

interface ListGeneratorProps {
  listName: string;
  listItems?: ListItem[];
}

const ListGenerator: React.FC<ListGeneratorProps> = ({
  listName,
  listItems,
}) => {
  const [items, setItems] = useState<ListItem[]>(listItems || []);
  const [inputValue, setInputValue] = useState<string>('');

  let nextId = items.length + 1;

  function handleDeleteItem(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  function handleAddItem() {
    const newItem: ListItem = {
      id: nextId++,
      name: inputValue,
      default: false,
    };
    setItems([...items, newItem]);
    setInputValue('');
  }

  function handleSetDefault(id: number) {
    setItems(items.map((item) => ({ ...item, default: item.id === id })));
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  }

  return (
    <div>
      <div className="mb-2 text-xl font-semibold">{listName}</div>
      <ul className="w-96 list-disc">
        {items.map((item) => (
          <li key={item.id} className="grid list-disc grid-cols-3 gap-6">
            <div className="text-lg">{item.name}</div>
            <div>
              {item.default ? (
                <div className="font-semibold text-gray-800">default</div>
              ) : (
                <div
                  className="cursor-pointer text-gray-800"
                  onClick={() => handleSetDefault(item.id)}
                >
                  make default
                </div>
              )}
            </div>
            <div
              className="cursor-pointer text-gray-800"
              onClick={() => handleDeleteItem(item.id)}
            >
              delete
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <input
          type="text"
          className="rounded-lg border border-gray-600"
          placeholder={`add item`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleInputKeyDown(e)}
        ></input>
        {/* <button className="mx-4 flex w-4" onClick={handleAddItem}>
          add
        </button> */}
      </div>
    </div>
  );
};

export default ListGenerator;
