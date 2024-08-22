// 'use client'

// import PDFDocument from 'pdfkit';
// import blobStream from 'blob-stream'


// export default function viewPdf(note) { 

//   const regularFontPath = '/fonts/Inter-Regular.ttf'
//   const boldFontPath = '/fonts/Inter-Bold.ttf'

    
//   const doc = new PDFDocument({ "font": '/fonts/Inter-Regular.ttf' });
// const stream = doc.pipe(blobStream())
    
//   doc.registerFont('bold', boldFontPath);
//   doc.registerFont('regular', regularFontPath);

//   doc.font('bold').text(`Patient name: `, {continued: true});
//   doc.font('regular').text(`${note.patient.last_name}, ${note.patient.first_name} ${note.patient.middle_name? note.patient.middle_name: ''}`)
//   // doc.moveDown();
//   doc.font('bold').text(`Patient date of birth: `, {continued: true});
//   doc.font('regular').text(`${note.patient.date_of_birth}`);
//   doc.font('bold').text(`Patient age: `, {continued: true});
//   doc.font('regular').text(`${note.patient_age_years} years old`);
//   doc.font('bold').text(`Appointment Date: `, {continued: true});
//   doc.font('regular').text(`${note.appointment_date}`);
//   doc.font('bold').text(`Appointment Time: `, { continued: true });
//   doc.font('regular').text(`${note.appointmentTime}`);
//   doc.font('bold').text(`Appointment Type: `, {continued: true});
//   doc.font('regular').text(`${note.appointment_type}`);
//   doc.font('bold').text(`Appointment Specialty: `, {continued: true});
//   doc.font('regular').text(`${note.appointment_specialty}`);
//   doc.font('bold').text(`Patient is located in: `, {continued: true});
//   doc.font('regular').text(`${note.patient_location}`);
//   doc.font('bold').text(`Consent: `, { continued: true });
//   doc.font('regular').text(`Patient consents to treatment`);
//   doc.font('bold').text(`Allergies: `, { continued: true });
//   doc.font('regular').text(`${note.patient.allergies}`);
//   doc.moveDown();
//   doc.moveDown();
//   doc.moveTo(0 + 50, doc.y)
//     .lineTo(doc.page.width - 50, doc.y)
//     .stroke();
//   doc.moveDown();
//   doc.moveDown();
//   doc.font('bold').text(`Chief Complaint: `);
//   doc.font('regular').text(`${note.chief_complaint}`);
//   doc.moveDown();
//   doc.font('bold').text(`Subjective: `);
//   doc.font('regular').text(`${note.soap_subjective?.replace(/\r\n|\r/g, '\n')}`);
//   doc.moveDown();
//   doc.font('bold').text(`Objective: `);
//   doc.font('regular').text(`${note.soap_objective?.replace(/\r\n|\r/g, '\n')}`);
//   doc.moveDown();
//   doc.font('bold').text(`Assessment: `);
//   doc.font('regular').text(`${note.soap_assessment?.replace(/\r\n|\r/g, '\n')}`);
//   doc.moveDown();
//   doc.font('bold').text(`Plan: `);
//   doc.font('regular').text(`${note.soap_plan?.replace(/\r\n|\r/g, '\n')}`);
//    doc.moveDown();
//   doc.font('bold').text(`Plan: `);
//   doc.font('regular').text(`${note.patient_instructions?.replace(/\r\n|\r/g, '\n')}`);
//   doc.moveDown();
//   doc.moveDown();
//   doc.font('bold').text(`Doctor Signature:`);
//   doc.font('regular').text(`${note.doctor_signature}`); 

//     doc.end();
    
//     stream.on('finish', function () {
//         const url = stream.toBlobURL('application/pdf');
//         iframe.src = url;
//     })
// }