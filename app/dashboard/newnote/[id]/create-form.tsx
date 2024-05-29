// 'use client';
// import { useCallback, useEffect, useState, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/utils/supabase/client';
// import { Button } from '@/app/ui/button';
// import {
//   CheckIcon,
//   BuildingOffice2Icon,
//   CalendarDaysIcon,
//   UserCircleIcon,
//   PencilSquareIcon,
// } from '@heroicons/react/24/outline';
// import { GeistSans } from 'geist/font/sans';

// import { Note } from '@/app/lib/definitions';
// import { getSignedAudioUrl } from '@/app/lib/data';
// import { submitNote, submitNoteDraft } from './action';
// import { DeleteNoteFirstStep } from '@/app/ui/notes/buttons';

// interface CreateAppointmentProps {
//   appointment: Appointment;
// }

// const CreateAppointmentPrefilled: React.FC<CreateAppointmentProps> = ({
//   appointment,
// }) => {
//   // pass in Appointment object data to pre-populate form
//   const [loading, setLoading] = useState<boolean>(true);
//   const [audioUrl, setAudioUrl] = useState<string>('');
//   const [apptid, setApptid] = useState<string>(appointment.id);
//   const [patientName, setPatientName] = useState<string | null>(
//     appointment?.patient_name || null,
//   );
//   const [chiefComplaint, setChiefComplaint] = useState<string | null>(
//     appointment?.chief_complaint || null,
//   );
//   const [date, setDate] = useState<string>(appointment?.appointment_date || '');
//   const [appointmentTime, setAppointmentTime] = useState<string>(
//     appointment?.appointment_time || '',
//   );
//   const [patientDateOfBirth, setPatientDateOfBirth] = useState<string>(
//     appointment?.patient_date_of_birth || '',
//   );
//   const [allergies, setAllergies] = useState<string>(
//     appointment?.allergies || '',
//   );
//   const [consent, setConsent] = useState<boolean | null>(
//     appointment?.consent || null,
//   );
//   const [subjective, setSubjective] = useState<string | null>(
//     appointment?.soap_subjective || null,
//   );
//   const [objective, setObjective] = useState<string | null>(
//     appointment?.soap_objective || null,
//   );
//   const [assessment, setAssessment] = useState<string | null>(
//     appointment?.soap_assessment || null,
//   );
//   const [plan, setPlan] = useState<string | null>(
//     appointment?.soap_plan || null,
//   );
//   const [secondOpinion, setSecondOpinion] = useState<string | null>(
//     appointment?.second_opinion || null,
//   );
//   const [doctorSignature, setDoctorSignature] = useState<string>(
//     appointment?.doctor_signature || '',
//   );

//   // Ref declarations with types
//   const subjectiveRef = useRef<HTMLTextAreaElement | null>(null);
//   const objectiveRef = useRef<HTMLTextAreaElement | null>(null);
//   const assessmentRef = useRef<HTMLTextAreaElement | null>(null);
//   const planRef = useRef<HTMLTextAreaElement | null>(null);
//   const secondOpinionRef = useRef<HTMLTextAreaElement | null>(null);

//   // Refactored autoResizeTextarea function with type
//   const autoResizeTextarea = (
//     textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>,
//   ) => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = 'auto'; // Reset the height
//       textarea.style.height = `${textarea.scrollHeight + 10}px`; // Set the height to scrollHeight
//     }
//   };

//   // useEffect hooks for each textarea
//   useEffect(() => {
//     autoResizeTextarea(subjectiveRef);
//   }, [subjective]);

//   useEffect(() => {
//     autoResizeTextarea(objectiveRef);
//   }, [objective]);

//   useEffect(() => {
//     autoResizeTextarea(assessmentRef);
//   }, [assessment]);

//   useEffect(() => {
//     autoResizeTextarea(planRef);
//   }, [plan]);

//   useEffect(() => {
//     autoResizeTextarea(secondOpinionRef);
//   }, [secondOpinion]);

//   useEffect(() => {
//     const fetchAudioUrl = async () => {
//       if (appointment?.audio_storage_url) {
//         try {
//           const url = await getSignedAudioUrl(
//             appointment.user_id,
//             appointment.audio_storage_url,
//           );
//           console.log('signed url:', url);
//           setAudioUrl(url);
//         } catch (error) {
//           console.error('Error fetching audio url:', error);
//         }
//       }
//     };

//     fetchAudioUrl();

//     console.log(
//       'appointment data from client CreateAppointmentPrefilled:',
//       appointment,
//     );
//   }, []);

//   const router = useRouter();

//   return (
//     <div className="w-full">
//       <div className="mb-8 flex w-full">
//         <h1 className={`${GeistSans.className} text-2xl`}>Review Draft</h1>
//       </div>
//       <form className="max-w-prose">
//         <input name="id" hidden defaultValue={appointment?.id}></input>

//         <div className="mb-8 max-w-prose rounded-md bg-gray-50 p-4">
//           <div className="mb-8 text-lg font-medium text-gray-800">
//             SOAP note
//           </div>
//           <div className="grid grid-cols-2 gap-8">
//             {/* Appointment Date */}
//             <div className="mb-4">
//               <label
//                 htmlFor="appointment_date"
//                 className="mb-2 block text-sm font-medium"
//               >
//                 Appointment Date
//               </label>
//               <div className="relative">
//                 <input
//                   id="appointment_date"
//                   name="appointment_date"
//                   required
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 ></input>
//               </div>
//             </div>

//             {/* Appointment Time */}
//             <div className="mb-4">
//               <label
//                 htmlFor="appointment_time"
//                 className="mb-2 block text-sm font-medium"
//               >
//                 Appointment Time
//               </label>
//               <div className="relative">
//                 <input
//                   id="appointment_time"
//                   name="appointment_time"
//                   required
//                   type="time"
//                   value={appointmentTime}
//                   onChange={(e) => setAppointmentTime(e.target.value)}
//                   className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 ></input>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-8">
//             <div className="mb-4">
//               <label
//                 htmlFor="patient_name"
//                 className="mb-2 block text-sm font-medium"
//               >
//                 Patient Name
//               </label>
//               <div className="relative">
//                 <input
//                   id="patient_name"
//                   name="patient_name"
//                   required
//                   placeholder="Patient seen during visit"
//                   type="text"
//                   className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                   value={patientName || ''}
//                   onChange={(e) => setPatientName(e.target.value)}
//                 ></input>
//                 <UserCircleIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//               </div>
//             </div>
//             {/* Patient Date of Birth */}
//             <div className="mb-4">
//               <label
//                 htmlFor="patient_date_of_birth"
//                 className="mb-2 block text-sm font-medium"
//               >
//                 Patient Date of Birth
//               </label>
//               <div className="relative">
//                 <input
//                   id="patient_date_of_birth"
//                   name="patient_date_of_birth"
//                   required
//                   type="date"
//                   value={patientDateOfBirth}
//                   onChange={(e) => setPatientDateOfBirth(e.target.value)}
//                   className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 ></input>
//                 <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-8">
//             <div className="mb-4">
//               <label
//                 htmlFor="allergies"
//                 className="mb-2 block text-sm font-medium"
//               >
//                 Allergies
//               </label>
//               <div className="relative">
//                 <input
//                   id="allergies"
//                   name="allergies"
//                   type="text"
//                   className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                   value={allergies || ''}
//                   onChange={(e) => setAllergies(e.target.value)}
//                 ></input>
//               </div>
//             </div>
//             {/* Telemedicine Consent */}
//             <div className="mb-4">
//               <label
//                 htmlFor="consent"
//                 className="mb-2 block text-sm font-medium"
//               >
//                 Telemedicine Consent
//               </label>
//               <div className="relative flex flex-row items-center pt-2">
//                 <input
//                   id="consent"
//                   name="consent"
//                   type="checkbox"
//                   checked={consent === true}
//                   required
//                   onChange={(e) => {
//                     setConsent(e.target.checked);
//                   }}
//                   className="peer mr-4 block h-6 w-6 cursor-pointer rounded-md border border-gray-200 text-sm outline-2 "
//                 ></input>
//                 <div className="text-sm">Patient consents to treatment.</div>
//               </div>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="chief_complaint"
//               className="mb-2 block text-sm font-medium"
//             >
//               Chief Complaint
//             </label>
//             <div className="relative">
//               <input
//                 id="chief_complaint"
//                 name="chief_complaint"
//                 required
//                 type="text"
//                 className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 value={chiefComplaint || ''}
//                 onChange={(e) => setChiefComplaint(e.target.value)}
//               ></input>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="soap_subjective"
//               className="mb-2 block text-sm font-medium"
//             >
//               Subjective
//             </label>
//             <div className="relative">
//               <textarea
//                 id="soap_subjective"
//                 name="soap_subjective"
//                 ref={subjectiveRef}
//                 className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 value={subjective || ''}
//                 onChange={(e) => setSubjective(e.target.value)}
//               ></textarea>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="soap_objective"
//               className="mb-2 block text-sm font-medium"
//             >
//               Objective
//             </label>
//             <div className="relative">
//               <textarea
//                 id="soap_objective"
//                 name="soap_objective"
//                 ref={objectiveRef}
//                 className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 value={objective || ''}
//                 onChange={(e) => setObjective(e.target.value)}
//               ></textarea>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="soap_assessment"
//               className="mb-2 block text-sm font-medium"
//             >
//               Assessment
//             </label>
//             <div className="relative">
//               <textarea
//                 id="soap_assessment"
//                 name="soap_assessment"
//                 ref={assessmentRef}
//                 className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 value={assessment || ''}
//                 onChange={(e) => setAssessment(e.target.value)}
//               ></textarea>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="soap_plan"
//               className="mb-2 block text-sm font-medium"
//             >
//               Plan
//             </label>
//             <div className="relative">
//               <textarea
//                 id="soap_plan"
//                 name="soap_plan"
//                 ref={planRef}
//                 className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 value={plan || ''}
//                 onChange={(e) => setPlan(e.target.value)}
//               ></textarea>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="doctor_signature"
//               className="mb-2 block text-sm font-medium"
//             >
//               Doctor Signature
//             </label>
//             <div className="relative">
//               <input
//                 id="doctor_signature"
//                 name="doctor_signature"
//                 type="text"
//                 className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
//                 value={doctorSignature || ''}
//                 onChange={(e) => setDoctorSignature(e.target.value)}
//               ></input>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end gap-4">
//             <Link
//               href="/dashboard/notes"
//               className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//             >
//               Cancel
//             </Link>
//             <DeleteNoteFirstStep id={appointment.id} />
//             <Button formAction={submitNoteDraft} secondary>
//               Save Draft
//             </Button>
//             <Button formAction={submitNote} active={doctorSignature !== ''}>
//               Approve Note
//             </Button>
//           </div>
//         </div>

//         <div className="collapse-title text-lg font-medium text-gray-600">
//           Audio Memo
//         </div>
//         {audioUrl ? (
//           <audio className="w-full" controls>
//             <source type="audio/mp3" src={audioUrl} />
//             Your browser does not support the audio element.
//           </audio>
//         ) : (
//           <div
//             className={`flex h-[54px] w-full flex-col justify-center rounded-full bg-gray-100`}
//           >
//             <div className="ml-8"></div>
//           </div>
//         )}

//         <div
//           tabIndex={0}
//           className="collapse collapse-plus my-4 rounded-md border"
//         >
//           <div className="collapse-title text-lg font-medium text-gray-600">
//             Audio Memo Transcript
//           </div>
//           <div className="collapse-content">
//             <p className="text-sm">{appointment?.audio_transcript}</p>
//             <p className="mt-6 text-center text-xs italic text-gray-700">
//               Audio transcription is for reference only and will not be included
//               with the approved SOAP note.
//             </p>
//           </div>
//         </div>

//         <div
//           tabIndex={0}
//           className="collapse collapse-plus mb-4 rounded-md  border"
//         >
//           <div className="collapse-title text-lg font-medium text-gray-600">
//             Differential Diagnosis
//           </div>
//           <div className="collapse-content">
//             <p className="text-sm">{secondOpinion}</p>
//             <p className="mt-6 text-center text-xs italic text-gray-700">
//               This differential diagnosis is for reference only and will not be
//               included with the approved SOAP note.
//             </p>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateAppointmentPrefilled;
