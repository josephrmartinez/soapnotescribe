'use client'
import { DocumentIcon } from '@heroicons/react/24/outline';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export function ViewPDFButton({ note }) {
  function handleViewPdf() {
    // console.log('processed note:', note);
    
    const docDefinition = {
      content: [
    
        { style: 'bold', text: ['Patient Name: ', { text: `${note.patient.first_name} ${note.patient.last_name}`, style: 'regular' }] },
        { style: 'bold', text: ['Patient Date of Birth: ', { text: `${note.patient.date_of_birth}`, style: 'regular' }] },
        { style: 'bold', text: ['Patient Age: ', { text: `${note.patient_age_years}`, style: 'regular' }] },
        { style: 'bold', text: ['Appointment Date: ', { text: `${note.appointmentDate}`, style: 'regular' }] },
        { style: 'bold', text: ['Appointment Time: ', { text: `${note.appointmentTime}`, style: 'regular' }] },
        { style: 'bold', text: ['Appointment Type: ', { text: `${note.appointment_type}`, style: 'regular' }] },
        { style: 'bold', text: ['Appointment Specialty: ', { text: `${note.appointment_specialty}`, style: 'regular' }] },
        { style: 'bold', text: ['Patient Location: ', { text: `${note.patient_location}`, style: 'regular' }] },
        { style: 'bold', text: ['Consent ', { text: `Patient consents to treatment`, style: 'regular' }] },
        { style: 'bold', text: ['Allergies: ', { text: `${note.allergies}\n\n\n\n`, style: 'regular' }] },
        { style: 'bold', text: `Chief Complaint:` },
        { style: 'regular', text: `${note.chief_complaint}\n\n\n` },
        { style: 'bold', text: `Subjective:` },
        { style: 'regular', text: `${note.soap_subjective}\n\n\n` },
        { style: 'bold', text: `Objective:` },
        { style: 'regular', text: `${note.soap_objective}\n\n\n` },
        { style: 'bold', text: `Assessment:` },
        { style: 'regular', text: `${note.soap_assessment}\n\n\n` },
        { style: 'bold', text: `Plan:` },
        { style: 'regular', text: `${note.soap_plan}\n\n\n` },
        { style: 'bold', text: `Doctor Signature:` },
        { style: 'regular', text: `${note.doctor_signature}` },
        
  ],
      styles: {
        bold: {
          fontSize: 10,
          bold: true
        },
        regular: {
          fontSize: 10,
          bold: false
        }
      }
};

    pdfMake.createPdf(docDefinition).open();
  }

  return (
    <div
      onClick={handleViewPdf}
      className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-gray-100 px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
    >
      <DocumentIcon width={20} height={20} className="mr-2" />
      pdf
    </div>
  );
}
