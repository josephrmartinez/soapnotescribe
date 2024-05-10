import { createClient } from '@/utils/supabase/server';
import PDFDocument from 'pdfkit';


export async function generateAndSavePdf(appointmentData: any) {
  // Initialize Supabase client
    const supabase = createClient();
    const userId = appointmentData.user_id;

    console.log("calling generateAndSavePdf with following data:", appointmentData)

  // Generate PDF
  const doc = new PDFDocument({ font: 'public/fonts/Inter-Regular.ttf' });
  
  doc.registerFont('bold', 'public/fonts/Inter-Bold.ttf');
  doc.registerFont('regular', 'public/fonts/Inter-Regular.ttf');

  doc.font('bold').text(`Patient name: `, {continued: true});
  doc.font('regular').text(`${appointmentData.patient_name}`)
  doc.moveDown();
  doc.font('bold').text(`Patient date of birth: `, {continued: true});
  doc.font('regular').text(`${appointmentData.patient_date_of_birth}`);
  doc.moveDown();
doc.font('bold').text(`Allergies: `, {continued: true});
  doc.font('regular').text(`${appointmentData.allergies}`);
  doc.moveDown();
  doc.font('bold').text(`Appointment Date: `, {continued: true});
  doc.font('regular').text(`${appointmentData.appointment_date}`);
  doc.moveDown();
  doc.font('bold').text(`Appointment Time: `, {continued: true});
  doc.font('regular').text(`${appointmentData.appointment_time}`);
  doc.moveDown();
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
  doc.font('regular').text(`${appointmentData.chief_complaint}`);
  doc.moveDown();
  doc.font('bold').text(`Subjective: `);
  doc.font('regular').text(`${appointmentData.soap_subjective}`);
  doc.moveDown();
  doc.font('bold').text(`Objective: `);
  doc.font('regular').text(`${appointmentData.soap_objective}`);
  doc.moveDown();
  doc.font('bold').text(`Assessment: `);
  doc.font('regular').text(`${appointmentData.soap_assessment}`);
  doc.moveDown();
  doc.font('bold').text(`Plan: `);
  doc.font('regular').text(`${appointmentData.soap_plan}`);
  doc.moveDown();
  doc.moveDown();
  doc.font('bold').text(`Doctor Signature:`);
  doc.font('regular').text(`${appointmentData.doctor_signature}`); 

    const pdfBuffer: Buffer[] = []
    
     // Pipe the PDF document to the buffer
  doc.on('data', (chunk) => pdfBuffer.push(chunk));
  doc.on('end', async () => {
    // Concatenate the buffer chunks into a single buffer
    const pdfData = Buffer.concat(pdfBuffer);
    
    // Define the path where the PDF will be stored in Supabase Storage
    const filePath = `${userId}/${appointmentData.patient_name}/${appointmentData.appointment_date}.pdf`;

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