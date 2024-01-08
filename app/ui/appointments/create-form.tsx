'use client'

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

import { ProviderField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  CurrencyDollarIcon, BuildingOffice2Icon,
  CalendarDaysIcon,
  UserCircleIcon, PencilSquareIcon
  
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createAppointment } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createAppointment, initialState);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleAudioUpload = async (event: React.MouseEvent) => {
    try {
      event.preventDefault();

      if (!inputFileRef.current) {
        throw new Error("inputFileRef is null.");
      }
  
      const fileInput = inputFileRef.current;
  
      if (!fileInput.files || fileInput.files.length === 0) {
        throw new Error("No file selected.");
      }

      setIsUploading(true);
  
      const file = fileInput.files[0];
  
      if (!file) {
        throw new Error("No file selected.");
      }
  
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/appointments/upload',
      });
  
      setBlob(newBlob);
    } catch (error) {
      console.error("Error uploading file:", error);
      // You can handle the error further as needed, e.g., show a notification to the user.
    } finally {
      setIsUploading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Include the audio information in the form data
    const formData = new FormData(event.target);
    formData.append('audio_url', blob?.url || '');

    console.log("form data:", formData)
    // try {
    //   // Submit the form data (including audio URL) to the server
    //   const response = await fetch('/api/appointment/create', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     console.log('Form submission successful:', result);
    //     // Handle success if needed
    //   } else {
    //     console.error('Form submission failed');
    //     // Handle failure if needed
    //   }
    // } catch (error) {
    //   console.error('Form submission error:', error);
    //   // Handle error if needed
    // }
  };


  
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Appointment Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Appointment Title
          </label>
          <div className="relative">
            <input
              id="title"
              name="title"
              type='text'
              placeholder='Appointment name'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='title-error'
            >
              
            </input>
            <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Appointment Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              placeholder='Brief description of appointment'
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='description-error'
            >
              
            </input>
            <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Provider */}
        <div className="mb-4">
          <label htmlFor="provider" className="mb-2 block text-sm font-medium">
            Provider
          </label>
          <div className="relative">
            <input
              id="provider"
              name="provider"
              placeholder='Doctor or name of provider(s) seen during visit'
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='provider-error'
            >
              
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="provider-error" aria-live="polite" aria-atomic="true">
            {state.errors?.provider &&
              state.errors.provider.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Clinic */}
        <div className="mb-4">
          <label htmlFor="clinic" className="mb-2 block text-sm font-medium">
            Clinic
          </label>
          <div className="relative">
            <input
              id="clinic"
              name="clinic"
              placeholder='Clinic, facility name'
              type='text'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='clinic-error'
            >
              
            </input>
            <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="clinic-error" aria-live="polite" aria-atomic="true">
            {state.errors?.clinic &&
              state.errors.clinic.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="appointment_date" className="mb-2 block text-sm font-medium">
            Appointment Date
          </label>
          <div className="relative">
            <input
              id="appointment_date"
              name="appointment_date"
              type="date"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='date-error'
            >
              
            </input>
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="date-error" aria-live="polite" aria-atomic="true">
            {state.errors?.appointment_date &&
              state.errors.appointment_date.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Amount Paid */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Amount Paid
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
        {state.errors?.amount &&
          state.errors.amount.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>  
        </div>
        
        {/* Appointment Recording */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Appointment Recording
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
              
                <input
                  id="audio_path"
                  name="audio_path"
                  ref={inputFileRef}
                  aria-describedby='audio-error'
                  type="file"
                  accept="audio/mpeg, audio/mp3"
                  className="cursor-pointer text-sm border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <button type="button" className="border p-2 mx-4" onClick={handleAudioUpload}>
                  Upload Audio
                </button>
                {isUploading && 
                <div>audio uploading</div>
                }
                
              </div>
              
            </div>
          </div>
          
        </fieldset>
        


      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/appointments"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Appointment</Button>
      </div>
    </form>
  );
}
