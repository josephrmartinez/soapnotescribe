'use client';

import { DocumentIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface ViewPdfButtonProps {
  viewPdf: () => void; // Adjust the type according to the expected function signature
}

const ViewPdfButton: React.FC<ViewPdfButtonProps> = ({ viewPdf }) => {
  return (
    <div
      onClick={viewPdf}
      className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-gray-100 px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 "
    >
      <DocumentIcon width={20} height={20} className="mr-2" />
      pdf
    </div>
  );
};

export default ViewPdfButton;
