'use client';

import { useState } from 'react';

interface CopyTextButtonProps {
  buttonText: string;
  inputText: string;
  copied: boolean;
  onCopy: () => void;
}

const CopyTextButton: React.FC<CopyTextButtonProps> = ({
  buttonText,
  inputText,
  copied,
  onCopy,
}) => {
  function handleClick() {
    onCopy();
    navigator.clipboard.writeText(inputText);
  }

  return (
    <div
      className="block cursor-pointer text-sm font-medium text-gray-600 underline underline-offset-4"
      onClick={handleClick}
    >
      {copied ? 'copied' : buttonText}
    </div>
  );
};

export default CopyTextButton;
