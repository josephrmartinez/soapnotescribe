import { createClient } from '@/utils/supabase/server';
import PDFDocument from 'pdfkit';

export async function generateAndSavePdf(appointmentData: any) {
  // Initialize Supabase client
    const supabase = createClient();
    
    const userId = (await supabase.auth.getUser()).data.user?.id

  // Generate PDF
  const doc = new PDFDocument();
  doc.text(`Appointment Title: ${appointmentData.title}`);
  doc.text(`Date: ${appointmentData.appointment_date}`);
  doc.text(`Time: ${appointmentData.appointment_time}`);

  // Define the path where the PDF will be stored in Supabase Storage
  const filePath = `${userId}/${appointmentData.id}.pdf`;

  // Convert the PDF document to a buffer
  const pdfBuffer = await doc.toBuffer();

  // Upload the PDF to Supabase Storage
  const { error } = await supabase.storage.from('public').upload(filePath, pdfBuffer);
  if (error) {
    console.error('Error uploading PDF to Supabase Storage:', error);
    return;
  }

  console.log('PDF uploaded successfully');
}
