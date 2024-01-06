'use client'

import React, { useState } from 'react';

const IncrementCounter: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const incrementCounter = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Increment Counter</h2>
      <p>Count: {count}</p>
      <button onClick={incrementCounter}>Increment</button>
    </div>
  );
};

export default IncrementCounter;