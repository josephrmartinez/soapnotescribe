'use client'

import React from "react"
import { ArrowRight, Printer, SpinnerGap } from "@phosphor-icons/react";
import { useState } from 'react';


export function PreparationModule(){

    const [type, setType] = useState<string>("")
  const [situation, setSituation] = useState<string>("")
  const [concerns, setConcerns] = useState<string>("")
  const [history, setHistory] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setLoading(true)
  
    try {
      const response = await fetch('/api/prepare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, situation, concerns, history }),
      });
      const data = await response.json();
  
      if (data.output && data.output.content) {
        setQuestions(data.output.content);
      }
  
      // Clear input fields
      // setType("");
      // setSituation("");
      // setConcerns("");
      // setHistory("");
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
      
    }
  }

  const handlePrint = () => {
    const printableWindow = window.open('', '_blank');
    
    if (printableWindow){
      printableWindow.document.write('<html><head><title>Print</title>');
      printableWindow.document.write('<style>');
      printableWindow.document.write('body { margin: 20px; font-size: 16px; }');
      printableWindow.document.write('pre { white-space: pre-wrap; }');
      printableWindow.document.write('</style>');
      printableWindow.document.write('</head><body>');
      printableWindow.document.write('<pre>' + questions + '</pre>');
      printableWindow.document.write('</body></html>');
      
      printableWindow.document.close();
      printableWindow.print();
    }
    
  };

    return (
<form onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 mt-8 gap-8'>
          <div>
            <div className='text-gray-600 font-semibold'>Type of appointment:</div>
            <input
              type='text'
              id="type"
              name="type"
              className='border border-gray-300 rounded-lg mb-6'
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            
            {/* Repeat the following pattern for each input */}
            <div className='text-gray-600 font-semibold'>Situation:</div>
            <textarea
              id="situation"
              name="situation"
              className='border border-gray-300 rounded-lg w-full mb-6 h-24'
              placeholder='Describe your current health concern or symptoms. What prompted you to schedule this appointment?'
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            ></textarea>

            <div className='text-gray-600 font-semibold'>Expectations and Concerns</div>
            <textarea
              id="concerns"
              name="concerns"
              className='border border-gray-300 rounded-lg w-full mb-6 h-24'
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder={`What would you like to get out of the appointment? Are there specific concerns or questions you want to address with your doctor?`}
            ></textarea>

            <div className='text-gray-600 font-semibold'>Treatment and Medication History</div>
            <textarea
              id="history"
              name="history"
              className='border border-gray-300 rounded-lg w-full mb-6 h-24'
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder={`Information on any current medications you're taking, including dosage and frequency. Have you tried any treatments or interventions for your current health concern?`}
            ></textarea>

            <div className='flex flex-row w-full justify-end'>
              {!loading ? <button
                type="button"
                onClick={handleSubmit}
                className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span className="">Generate questions</span>{' '}
                <ArrowRight size={28} className="h-5 md:ml-4" />
              </button>
              :
              <div
                className={`flex h-10 items-center rounded-lg border px-4 text-sm font-medium text-gray-700 transition-colors bg-gray-50 hover:bg-gray-100`}
              >
                <span>Generating questions</span>{' '}
                {/* <SpinnerGap className="h-5 md:ml-4" /> */}
              </div>
              }
              

            </div>
          </div>

          <div>
            <div className='flex flex-row items-center justify-between mb-2'>
              <div className='text-gray-600 font-semibold'>Questions for your upcoming appointment:</div>
              {questions === "" ? 
              <div 
              className='p-2 flex flex-row border rounded-lg transition-all'>
                <div className='text-sm font-semibold mr-1'>PRINT</div>
                <Printer size={22}/>
              </div>
              :
              <button 
              className='cursor-pointer p-2 flex flex-row border rounded-lg bg-teal-600 transition-all'
              onClick={handlePrint}>
                <div className='text-sm font-semibold mr-1 text-white'>PRINT</div>
                <Printer size={22} color='white'/>
              </button>
            }
            </div>
            <textarea
              id="questions"
              name="questions"
              className='border border-gray-300 rounded-lg w-full h-[34rem]'
              placeholder='AI generated questions will appear here.' 
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
            ></textarea>
          </div>

          </div>
        </form>
    )
}
