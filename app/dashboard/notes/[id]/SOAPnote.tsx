// 'use client'

// export default function SOAPnote(note) {

//     return (
//       <div id="soapnote" className="mb-4 max-w-prose rounded-md bg-gray-50 p-4">
//         <div className="mb-4 grid grid-cols-2 gap-x-8 gap-y-4">
//           {/* patient name */}
//           <div className="col-span-2">
//             <label
//               htmlFor="patient_name"
//               className="mb-2 block text-sm font-medium"
//             >
//               Patient Name
//             </label>

//             <div id="patient_name" className="ml-2 text-sm">
//               {note.patient.last_name}, {note.patient.first_name}{' '}
//               {note.patient.middle_name && note.patient.middle_name}
//             </div>
//           </div>

//           {/* Patient Date of Birth */}
//           <div className="">
//             <label
//               htmlFor="appointment_date"
//               className="mb-2 block text-sm font-medium"
//             >
//               Patient Date of Birth
//             </label>
//             <div className="relative">
//               <div id="patient_dob" className="ml-2 text-sm">
//                 {note.patientDOB}
//               </div>
//             </div>
//           </div>

//           {/* Patient Age */}
//           <div className="">
//             <label
//               htmlFor="appointment_date"
//               className="mb-2 block text-sm font-medium"
//             >
//               Patient Age
//             </label>

//             <div id="patient_age" className="ml-2 text-sm">
//               {note.patientAge}
//             </div>
//           </div>

//           {/* Appointment Date */}
//           <div className="">
//             <label
//               htmlFor="appointment_date"
//               className="mb-2 block text-sm font-medium"
//             >
//               Appointment Date
//             </label>
//             <div id="appointment_date" className="ml-2 text-sm">
//               {note.appointmentDate}
//             </div>
//           </div>

//           {/* Appointment Time */}
//           <div className="">
//             <label
//               htmlFor="appointment_time"
//               className="mb-2 block text-sm font-medium"
//             >
//               Appointment Time
//             </label>
//             <div id="appointment_time" className="ml-2 text-sm">
//               {note.appointmentTime}
//             </div>
//           </div>

//           {/* Appointment Type */}
//           <div className="">
//             <label
//               htmlFor="appointment_type"
//               className="mb-2 block text-sm font-medium"
//             >
//               Appointment Type
//             </label>
//             <div id="appointment_type" className="ml-2 text-sm">
//               {note.appointment_type}
//             </div>
//           </div>

//           {/* Appointment Specialty */}
//           <div className="">
//             <label
//               htmlFor="appointment_specialty"
//               className="mb-2 block text-sm font-medium"
//             >
//               Appointment Specialty
//             </label>
//             <div id="appointment_specialty" className="ml-2 text-sm">
//               {note.appointment_specialty}
//             </div>
//           </div>

//           {/* Location */}
//           <div className="">
//             <label
//               htmlFor="appointment_location"
//               className="mb-2 block text-sm font-medium"
//             >
//               Patient Location
//             </label>
//             <div id="appointment_location" className="ml-2 text-sm">
//               {note.patient_location}
//             </div>
//           </div>

//           {/* Consent */}
//           <div className="">
//             <label htmlFor="consent" className="mb-2 block text-sm font-medium">
//               Consent
//             </label>
//             <div className="ml-2 text-sm">Patient consents to treatment.</div>
//           </div>
//         </div>

//         {/* Allergies */}
//         <div className="mb-4">
//           <label htmlFor="allergies" className="mb-2 block text-sm font-medium">
//             Allergies
//           </label>
//           <div className="ml-2 text-sm">{note.allergies}</div>
//         </div>

//         {/* Chief Complaint */}
//         <div className="mb-4">
//           <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
//             Chief Complaint
//           </label>
//           <div id="complaint" className="ml-2 text-sm">
//             {note.chief_complaint}
//           </div>
//         </div>

//         {/* Subjective */}
//         <div className="mb-4">
//           <label
//             htmlFor="subjective"
//             className="mb-2 block text-sm font-medium"
//           >
//             Subjective
//           </label>
//           <div id="subjective" className="px-2 text-sm">
//             {note.soap_subjective}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="objective" className="mb-2 block text-sm font-medium">
//             Objective
//           </label>
//           <div className="relative">
//             <div id="objective" className="px-2 text-sm">
//               {note.soap_objective || ''}
//             </div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="assessment"
//             className="mb-2 block text-sm font-medium"
//           >
//             Assessment
//           </label>
//           <div className="relative">
//             <div id="assessment" className="px-2 text-sm">
//               {note.soap_assessment || ''}
//             </div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="plan" className="mb-2 block text-sm font-medium">
//             Plan
//           </label>
//           <div className="relative">
//             <div id="plan" className="px-2 text-sm">
//               {note.soap_plan || ''}
//             </div>
//           </div>
//         </div>

//         <div className="mb-0">
//           <label
//             htmlFor="doctorsignature"
//             className="mb-2 block text-sm font-medium"
//           >
//             Doctor Signature
//           </label>
//           <div className="relative">
//             <div id="doctor_signature" className="px-2 text-sm">
//               {note.doctor_signature || ''}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// }
