'use client'

import React, { ReactNode, useState } from 'react';

interface Transcript {
  language: string;
  segments: Segment[];
  num_speakers: number;
}

interface Segment {
  end: string;
  text: string;
  start: string;
  speaker: string;
}
  
  const formatTranscript = (transcript: Transcript) => {
    return transcript.segments.map((segment) => (
      <div key={`${segment.start}-${segment.end}`}>
        <span className='font-bold text-sm text-gray-600'>[{segment.start}]  </span>
        <span className='font-semibold text-sm'>{segment.speaker}:  </span>
        <span>{segment.text}</span>
      </div>
    ));
  };
  

export default function AIContent ({transcript, summary, feedback} : {transcript: Transcript, summary: string, feedback: string}) {
    const [activeTab, setActiveTab] = useState('transcript');
      
      const handleTabClick = (tab: string) => {
        setActiveTab(tab);
      };
      

        return (
            <>
            
            <div className="grid grid-cols-5 mb-4">
                <button className={`text-lg font-semibold text-gray-400 mt-2 ${activeTab === 'transcript' && 'text-gray-700 underline underline-offset-4'}`}
                    onClick={() => handleTabClick('transcript')}>Transcript</button>
                <button className={`text-lg font-semibold ml-3 text-gray-400 mt-2 ${activeTab === 'summary' && 'text-gray-700 underline underline-offset-4'}`}
                    onClick={() => handleTabClick('summary')}>Summary</button>
                <button className={`text-lg font-semibold text-gray-400 col-span-2 mt-2 ${activeTab === 'feedback' && 'text-gray-700 underline underline-offset-4'}`}
                    onClick={() => handleTabClick('feedback')}>Advocate Feedback</button>
            </div>

            <div className="h-96 overflow-y-scroll border p-2 border-gray-100 bg-white  text-gray-800 rounded-lg">
            {activeTab === 'transcript' && <div>{formatTranscript(transcript)}</div>}
            {activeTab === 'summary' && <div>{summary}</div>}
            {activeTab === 'feedback' && <div>{feedback}</div>}
            </div>
            </>
        )
}

