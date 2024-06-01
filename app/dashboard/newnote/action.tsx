'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateAndSavePdf } from '@/utils/generatePdf';

export async function createNote(status: string, formData: FormData) {
  const supabase = createClient();

  console.log('formData', formData);

  let pdfStorageUrl = '';

  if (status === 'approved') {
    pdfStorageUrl = `${formData.get('last_name')} ${formData.get('first_name')}/${formData.get('appointment_date')}.pdf`;
  }

  const patientAgeValue = formData.get('patient_age');
  const patientAgeYears: number = Number(patientAgeValue);

  const { error, data } = await supabase
    .from('note')
    .insert({
      status: status,
      pdf_storage_url: pdfStorageUrl as string,
      appointment_date: formData.get('appointment_date') as string,
      appointment_time: formData.get('appointment_time') as string,
      patient_id: formData.get('patient_id') as string,
      allergies: formData.get('allergies') as string,
      consent: formData.get('consent') === 'true' ? true : false,
      patient_age_years: patientAgeYears,
      chief_complaint: formData.get('chief_complaint') as string,
      soap_objective: formData.get('soap_objective') as string,
      soap_subjective: formData.get('soap_subjective') as string,
      soap_assessment: formData.get('soap_assessment') as string,
      soap_plan: formData.get('soap_plan') as string,
      doctor_signature: formData.get('doctor_signature') as string,
    })
    .select();
  if (error) {
    console.error('Supabase error creating the note:', error.message);
    return;
  }
  if (data && data.length > 0) {
    console.log('data', data[0]);
    // Generate and save pdf to Supabase storage
    if (status === 'approved') {
      await generateAndSavePdf(data[0].id);
    }

    revalidatePath('/dashboard/notes', 'page');
    redirect('/dashboard/notes');
  } else {
    // Handle the case where the update was successful but the data is not as expected
    console.error('Update successful, but data is not as expected');
  }
}

// export async function submitNote(formData: FormData) {
//   const supabase = createClient();

//   console.log('formData', formData);

//   const pdfStorageUrl = `${formData.get('last_name')} ${formData.get('first_name')}/${formData.get('appointment_date')}.pdf`;

//   const patientAgeValue = formData.get('patient_age');
//   const patientAgeYears: number = Number(patientAgeValue);

//   const { error, data } = await supabase
//     .from('note')
//     .insert({
//       status: 'approved',
//       pdf_storage_url: pdfStorageUrl as string,
//       appointment_date: formData.get('appointment_date') as string,
//       appointment_time: formData.get('appointment_time') as string,
//       patient_id: formData.get('patient_id') as string,
//       allergies: formData.get('allergies') as string,
//       consent: formData.get('consent') === 'true' ? true : false,
//       patient_age_years: patientAgeYears,
//       chief_complaint: formData.get('chief_complaint') as string,
//       soap_objective: formData.get('soap_objective') as string,
//       soap_subjective: formData.get('soap_subjective') as string,
//       soap_assessment: formData.get('soap_assessment') as string,
//       soap_plan: formData.get('soap_plan') as string,
//       doctor_signature: formData.get('doctor_signature') as string,
//     })
//     .select();
//   if (error) {
//     console.error('Supabase error creating the note:', error.message);
//     return;
//   }
//   if (data && data.length > 0) {
//     console.log('data', data[0]);
//     // Generate and save pdf to Supabase storage
//     await generateAndSavePdf(data[0].id);

//     revalidatePath('/dashboard/notes', 'page');
//     redirect('/dashboard/notes');
//   } else {
//     // Handle the case where the update was successful but the data is not as expected
//     console.error('Update successful, but data is not as expected');
//   }
// }

// export async function submitNoteDraft(formData: FormData) {
//   const supabase = createClient();

//   console.log('formData', formData);

//   const patientAgeValue = formData.get('patient_age');
//   const patientAgeYears: number = Number(patientAgeValue);

//   const { error, data } = await supabase
//     .from('note')
//     .update({
//       status: 'awaiting review',
//       appointment_date: formData.get('appointment_date') as string,
//       appointment_time: formData.get('appointment_time') as string,
//       patient_name: formData.get('patient_name') as string,
//       patient_age_years: patientAgeYears,
//       allergies: formData.get('allergies') as string,
//       consent: formData.get('consent') === 'on' ? true : false,
//       chief_complaint: formData.get('chief_complaint') as string,
//       soap_objective: formData.get('soap_objective') as string,
//       soap_subjective: formData.get('soap_subjective') as string,
//       soap_assessment: formData.get('soap_assessment') as string,
//       soap_plan: formData.get('soap_plan') as string,
//       doctor_signature: formData.get('doctor_signature') as string,
//     })
//     .eq('id', formData.get('id'))
//     .select();
//   if (error) {
//     console.error('Supabase error updating the note:', error);

//     return;
//   }
//   if (data && data.length > 0) {
//     revalidatePath('/dashboard/notes', 'page');
//     redirect('/dashboard/notes');
//   } else {
//     // Handle the case where the update was successful but the data is not as expected
//     console.error('Update successful, but data is not as expected');
//   }
// }
