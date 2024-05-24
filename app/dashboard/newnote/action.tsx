'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateAndSavePdf } from '@/utils/generatePdf';
import { mapFormDataToObject } from '@/app/lib/utils';

export async function submitNote(formData: FormData) {
  const supabase = createClient();

  console.log('formData', formData);

  const fields = [
    'appointment_date',
    'appointment_time',
    'patient_id',
    'allergies',
    'consent',
    'chief_complaint',
    'soap_objective',
    'soap_subjective',
    'soap_assessment',
    'soap_plan',
    'doctor_signature',
  ];

  const formDataObject = mapFormDataToObject(formData, fields);

  console.log('formDataObject', formDataObject);

  const { error, data } = await supabase
    .from('notes')
    .insert({
      status: 'approved',
      appointment_date: formDataObject.appointment_date,
      appointment_time: formDataObject.appointment_time,
      patient_id: formDataObject.patient_id,
      allergies: formDataObject.allergies,
      consent: formDataObject.consent === 'true' ? true : false,
      chief_complaint: formDataObject.chief_complaint,
      soap_objective: formDataObject.soap_objective,
      soap_subjective: formDataObject.soap_subjective,
      soap_assessment: formDataObject.soap_assessment,
      soap_plan: formDataObject.soap_plan,
      doctor_signature: formDataObject.doctor_signature,
    })
    .select();
  if (error) {
    console.error('Supabase error creating the note:', error);

    return;
  }
  if (data && data.length > 0) {
    // Generate and save pdf to Supabase storage
    // await generateAndSavePdf(data[0]);

    // const filePath = `${userId}/${appointmentData.patient_name}/${appointmentData.appointment_date}.pdf`;

    // const { data, error } = await supabase.storage
    //   .from('avatars')
    //   .download('folder/avatar1.png');

    revalidatePath('/dashboard/notes', 'page');
    redirect('/dashboard/notes');
  } else {
    // Handle the case where the update was successful but the data is not as expected
    console.error('Update successful, but data is not as expected');
  }
}

export async function submitNoteDraft(formData: FormData) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('notes')
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
    console.error('Supabase error updating the note:', error);

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
