'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNote(status: string, formData: FormData) {
  const supabase = createClient();

  const patientAgeValue = formData.get('patient_age');
  const patientAgeYears: number = Number(patientAgeValue);

  console.log('formData:', formData);

  const { error, data } = await supabase
    .from('note')
    .insert({
      status: status,
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
      appointment_type: formData.get('appointment_type') as string,
      appointment_specialty: formData.get('appointment_specialty') as string,
      patient_location: formData.get('patient_location') as string,
    })
    .select();
  if (error) {
    console.error('Supabase error creating the note:', error.message);
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
