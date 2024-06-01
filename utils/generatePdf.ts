import { createClient } from '@/utils/supabase/server';
import PDFDocument from 'pdfkit';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';
import { fetchNoteById } from '@/app/lib/data';


export async function generateAndSavePdf(id: string) {  
  const note = await fetchNoteById(id)


  // Generate PDF
  const doc = new PDFDocument({ font: 'public/fonts/Inter-Regular.ttf' });
  
  doc.registerFont('bold', 'public/fonts/Inter-Bold.ttf');
  doc.registerFont('regular', 'public/fonts/Inter-Regular.ttf');

  doc.font('bold').text(`Patient name: `, {continued: true});
  doc.font('regular').text(`${note.patient.last_name}, ${note.patient.first_name}`)
  // doc.moveDown();
  doc.font('bold').text(`Patient date of birth: `, {continued: true});
  doc.font('regular').text(`${note.patient.date_of_birth}`);
  doc.font('bold').text(`Patient age: `, {continued: true});
  doc.font('regular').text(`${note.patient_age_years} years old`);
  // doc.moveDown();
doc.font('bold').text(`Allergies: `, {continued: true});
  doc.font('regular').text(`${note.allergies}`);
  // doc.moveDown();
  doc.font('bold').text(`Appointment Date: `, {continued: true});
  doc.font('regular').text(`${note.appointment_date}`);
  // doc.moveDown();
  doc.font('bold').text(`Appointment Time: `, {continued: true});
  doc.font('regular').text(`${note.appointment_time}`);
  // doc.moveDown();
  doc.font('bold').text(`Consent: `, {continued: true});
  doc.font('regular').text(`Patient consents to treatment`);
  doc.moveDown();
  doc.moveDown();
  doc.moveTo(0 + 50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke();
  doc.moveDown();
  doc.moveDown();
  doc.font('bold').text(`Chief Complaint: `);
  doc.font('regular').text(`${note.chief_complaint}`);
  doc.moveDown();
  doc.font('bold').text(`Subjective: `);
  doc.font('regular').text(`${note.soap_subjective?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.font('bold').text(`Objective: `);
  doc.font('regular').text(`${note.soap_objective?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.font('bold').text(`Assessment: `);
  doc.font('regular').text(`${note.soap_assessment?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.font('bold').text(`Plan: `);
  doc.font('regular').text(`${note.soap_plan?.replace(/\r\n|\r/g, '\n')}`);
  doc.moveDown();
  doc.moveDown();
  doc.font('bold').text(`Doctor Signature:`);
  doc.font('regular').text(`${note.doctor_signature}`); 

    const pdfBuffer: Buffer[] = []
    
     // Pipe the PDF document to the buffer
  doc.on('data', (chunk) => pdfBuffer.push(chunk));
  doc.on('end', async () => {
    // Concatenate the buffer chunks into a single buffer
    const pdfData = Buffer.concat(pdfBuffer);
    
    // Define the path where the PDF will be stored in Supabase Storage
    const filePath = `${note.user_id}/${note.patient.last_name} ${note.patient.first_name}/${note.appointment_date}.pdf`;

    // Initialize Supabase client
    const supabase = createClient();

    // Upload the PDF to Supabase Storage
    const { error } = await supabase.storage.from('pdfs').upload(filePath, pdfData, { upsert: true, contentType: "application/pdf" });

    if (error) {
      console.error('Error uploading PDF to Supabase Storage:', error);
      return;
    }

    console.log('PDF uploaded successfully');
  });

  // Finalize the PDF
  doc.end();
}