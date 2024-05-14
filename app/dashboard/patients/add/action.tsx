'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateAndSavePdf } from '@/utils/generatePdf';

export async function addPatient(formData: FormData) {
  const supabase = createClient();

  console.log('formData:', formData);

  //   const { error, data } = await supabase
  //     .from('patients')
  //     .upsert({
  //       status: 'approved',
  //       appointment_date: formData.get('appointment_date') as string,
  //       appointment_time: formData.get('appointment_time') as string,
  //       patient_name: formData.get('patient_name') as string,
  //       patient_date_of_birth: formData.get('patient_date_of_birth') as string,
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
  //     console.error('Supabase error creating or updating patient:', error);

  //     return;
  //   }
  //   if (data && data.length > 0) {
  //     revalidatePath('/dashboard/patients', 'page');
  //     redirect('/dashboard/patients');
  //   } else {
  //     // Handle the case where the update was successful but the data is not as expected
  //     console.error('Update successful, but data is not as expected');
  //   }
}

export async function submitAppointmentDraft(formData: FormData) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('appointments')
    .update({
      status: 'awaiting review',
      appointment_date: formData.get('appointment_date') as string,
      appointment_time: formData.get('appointment_time') as string,
      patient_name: formData.get('patient_name') as string,
      patient_date_of_birth: formData.get('patient_date_of_birth') as string,
      allergies: formData.get('allergies') as string,
      consent: formData.get('consent') === 'on' ? true : false,
      chief_complaint: formData.get('chief_complaint') as string,
      soap_objective: formData.get('soap_objective') as string,
      soap_subjective: formData.get('soap_subjective') as string,
      soap_assessment: formData.get('soap_assessment') as string,
      soap_plan: formData.get('soap_plan') as string,
      doctor_signature: formData.get('doctor_signature') as string,
    })
    .eq('id', formData.get('id'))
    .select();
  if (error) {
    console.error('Supabase error updating the appointment:', error);

    return;
  }
  if (data && data.length > 0) {
    revalidatePath('/dashboard/notes', 'page');
    redirect('/dashboard/notes');
  } else {
    // Handle the case where the update was successful but the data is not as expected
    console.error('Update successful, but data is not as expected');
  }
}
