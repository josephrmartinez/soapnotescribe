// 'use client'

// import React, { ReactNode, useState } from 'react';
// import { updateApptTranscript } from '@/app/lib/actions';

// interface Transcript {
//   language: string;
//   segments: Segment[];
//   num_speakers: number;
// }

// interface Segment {
//   end: string;
//   text: string;
//   start: string;
//   speaker: string;
// }

// interface RenameSpeakersFormProps {
//   speakerNames: string[];
//   onSave: (renamedSpeakers: Record<string, string>) => void;
// }

// interface AIContentProps {
//   transcript: Transcript;
//   summary: string;
//   feedback: string;
//   apptid: string;
// }
  
//   const formatTranscript = (transcript: Transcript) => {
//     return transcript.segments.map((segment) => (
//       <div key={`${segment.start}-${segment.end}`}>
//         <span className='font-bold text-sm text-gray-600'>[{segment.start}]  </span>
//         <span className='font-semibold text-sm'>{segment.speaker}:  </span>
//         <span>{segment.text}</span>
//       </div>
//     ));
//   };

//   const RenameSpeakersForm: React.FC<RenameSpeakersFormProps> = ({ speakerNames, onSave }) => {
//     const [viewForm, setViewForm] = useState(false)
//     const [renamedSpeakers, setRenamedSpeakers] = useState<Record<string, string>>({});
  
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = event.target;
//       setRenamedSpeakers(prevState => ({
//         ...prevState,
//         [name]: value
//       }));
//     };
  
//     const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//       event.preventDefault();
//       onSave(renamedSpeakers);
//       setViewForm(false);
//     };
  
//     return (
//       <div className='border-b-2 mb-2'>

//         {!viewForm ? 
//         <button 
//         className=" mb-2 text-sm flex flex-row rounded-md text-teal-600  p-2 transition-colors hover:bg-gray-100"
//         onClick={() => setViewForm(true)}
//         >update speaker names</button>
//         :
//         <form onSubmit={handleSubmit}>
//           {speakerNames.map((speaker, index) => (
//             <div key={index} className='mb-4 ml-2'>
//               <label 
//                 htmlFor={`speaker-${index}`}
//                 className='text-sm font-semibold mr-2'
//                 >Rename {speaker} to:</label>
//               <input
//                 type="text"
//                 id={`speaker-${index}`}
//                 name={speaker}
//                 value={renamedSpeakers[speaker] || ''}
//                 onChange={handleInputChange}
//                 className='border-b-2 border-gray-400 border-x-0 border-t-0 h-8 pl-1'
//                 autoFocus={index === 0}
//               />
//             </div>
//           ))}
//           <button type="submit" className='mb-4 flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"'>Save</button>
//         </form>
//         }
//       </div>
      
      

//     );
//   };

  

//   const AIContent: React.FC<AIContentProps> = ({ transcript, summary, feedback, apptid }) => {
//     const [activeTab, setActiveTab] = useState('transcript');
//     const [displayedTranscript, setDisplayedTranscript] = useState(transcript)
      
//       const handleTabClick = (tab: string) => {
//         setActiveTab(tab);
//       };

//       // Extract speaker names
//       const speakerNames = Array.from(new Set(transcript.segments.map(segment => segment.speaker)));
//       // console.log("speakers:", speakerNames)

//       // Update speaker names in transcript object
//       const handleSave = async (renamedSpeakers: Record<string, string>) => {
//         const updatedTranscript = {
//           ...transcript,
//           segments: transcript.segments.map(segment => ({
//             ...segment,
//             speaker: renamedSpeakers[segment.speaker] || segment.speaker
//           }))
//         };

//         setDisplayedTranscript(updatedTranscript); // Update state with the new transcript

    
//         // Step 5: Save changes to the database (Implement this part using Supabase SDK)
//         await updateApptTranscript(apptid, updatedTranscript)
    
//         // console.log('Updated transcript:', updatedTranscript);
//       }

      

//         return (
//             <>
            
//             <div className="grid grid-cols-5 mb-4">
//                 <button className={`text-lg font-semibold text-gray-400 mt-2 ${activeTab === 'transcript' && 'text-gray-700 underline underline-offset-4'}`}
//                     onClick={() => handleTabClick('transcript')}>Transcript</button>
//                 <button className={`text-lg font-semibold ml-3 text-gray-400 mt-2 ${activeTab === 'summary' && 'text-gray-700 underline underline-offset-4'}`}
//                     onClick={() => handleTabClick('summary')}>Summary</button>
//                 <button className={`text-lg font-semibold text-gray-400 col-span-2 mt-2 ${activeTab === 'feedback' && 'text-gray-700 underline underline-offset-4'}`}
//                     onClick={() => handleTabClick('feedback')}>Advocate Feedback</button>
//             </div>

//             <div className="h-96 overflow-y-scroll border p-2 border-gray-100 bg-white  text-gray-800 rounded-lg">
//             {activeTab === 'transcript' && 
//               <>
//                 <RenameSpeakersForm speakerNames={speakerNames} onSave={handleSave} />
//                 <div>{formatTranscript(displayedTranscript)}</div>
//               </>
//               }
//             {activeTab === 'summary' && <div>{summary}</div>}
//             {activeTab === 'feedback' && <div>{feedback}</div>}
//             </div>
//             </>
//         )
// }

// export default AIContent
