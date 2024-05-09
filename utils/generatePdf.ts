import { createClient } from '@/utils/supabase/server';
import PDFDocument from 'pdfkit';

export async function generateAndSavePdf(appointmentData: any) {
  // Initialize Supabase client
    const supabase = createClient();
    const userId = appointmentData.user_id;

    console.log("calling generateAndSavePdf with following data:", appointmentData)

  // Generate PDF
    const doc = new PDFDocument({font: 'public/fonts/Inter-Regular.ttf'});
    doc.text(`Patient name: ${appointmentData.patient_name}`);
    doc.text(`Patient name: ${appointmentData.patient_date_of_birth}`);
  doc.text(`Appointment Date: ${appointmentData.appointment_date}`);
    doc.text(`Appointment Time: ${appointmentData.appointment_time}`);
    doc.text(`Consent: Patient consents to treatment`);
    doc.text(`Allergies: ${appointmentData.allergies}`);
    doc.text(`Chief Complaint: ${appointmentData.chief_complaint}`);
    doc.text(`Subjective: ${appointmentData.soap_subjective}`);
    doc.text(`Objective: ${appointmentData.soap_objective}`);
    doc.text(`Assessment: ${appointmentData.soap_assessment}`);
    doc.text(`Plan: ${appointmentData.soap_plan}`);
    doc.text(`Doctor Signature: ${appointmentData.doctor_signature}`);

    // create a buffer to store the PDF
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