'use client'

import React, { useState } from 'react';
import { getWhisperTranscript } from '@/app/lib/actions';
const AudioUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files && event.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await getWhisperTranscript(formData)

      console.log('Transcription:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button type='submit'>Upload and Transcribe</button>
    </form>
  );
};

export default AudioUploadForm;