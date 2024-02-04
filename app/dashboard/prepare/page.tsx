'use client'


import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import Search from '@/app/ui/search';
import { ArrowRight, Printer } from "@phosphor-icons/react";

import React from 'react';
import { useState } from 'react';

// export const metadata: Metadata = {
//   title: "Prepare",
// }
 
export default function Page() {
  const [type, setType] = useState("")
  const [situation, setSituation] = useState("")
  const [concerns, setConcerns] = useState("")
  const [history, setHistory] = useState("")
  const [questions, setQuestions] = useState("")


  function handleSubmit(){
    console.log("Submitting input:", type, situation, concerns, history)
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>Prepare for Upcoming Appointments</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className='text-gray-700'>Fill out any of the fields below for help with generating questions to ask at your next appointment:</div>
      </div>

      <div className='grid grid-cols-2 mt-8 gap-8'>
        <div>
          <div className='text-gray-600 font-semibold'>Type of appointment:</div>
          <input type='text' className='border border-gray-300 rounded-lg mb-6'
          value={type}
          onChange={(e) => {setType(e.target.value)}}></input>

          <div className='text-gray-600 font-semibold'>Situation:</div>
          <textarea className='border border-gray-300 rounded-lg w-full mb-6 h-24'
          placeholder='Describe your current health concern or symptoms. What prompted you to schedule this appointment?'
          value={situation}
          onChange={(e) => {setSituation(e.target.value)}}></textarea>

          <div className='text-gray-600 font-semibold'>Expectations and Concerns</div>
          <textarea className='border border-gray-300 rounded-lg w-full mb-6 h-24'
          value={concerns}
          onChange={(e) => {setConcerns(e.target.value)}}
          placeholder={`What would you like to get out of the appointment? Are there specific concerns or questions you want to address with your doctor?`}></textarea>

          <div className='text-gray-600 font-semibold'>Treatment and Medication History</div>
          <textarea className='border border-gray-300 rounded-lg w-full mb-6 h-24'
          value={history}
          onChange={(e) => {setHistory(e.target.value)}}
          placeholder={`Information on any current medications you\'re taking, including dosage and frequency. Have you tried any treatments or interventions for your current health concern?`}></textarea>

          <div className='flex flex-row w-full justify-end'>
            <button
              className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={handleSubmit}
            >
              <span className="hidden md:block">Generate questions</span>{' '}
              <ArrowRight className="h-5 md:ml-4" />
            </button>
          </div>
          
        </div>

        <div>
          <div className='flex flex-row items-center justify-between mb-2'>
            <div className='text-gray-600 font-semibold'>Questions for your upcoming appointment:</div>
            <div className='cursor-pointer p-2 flex flex-row border rounded-lg'>
              <div className='text-sm font-semibold mr-1'>PRINT</div>
              <Printer size={22}/>
            </div>
          </div>
          <textarea className='border border-gray-300 rounded-lg w-full h-[34rem]'
          placeholder='AI generated questions will appear here.' 
          value={questions}
          onChange={(e) => {setQuestions(e.target.value)}}>
          </textarea>
        </div>

      </div>

      
    </div>
  )
}