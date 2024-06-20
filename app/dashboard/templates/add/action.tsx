'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTemplate(formData: FormData) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('template')
    .insert({
      chief_complaint: formData.get('chief_complaint') as string,
      soap_objective: formData.get('soap_objective') as string,
      soap_subjective: formData.get('soap_subjective') as string,
      soap_assessment: formData.get('soap_assessment') as string,
      soap_plan: formData.get('soap_plan') as string,
    })
    .select();
  if (error) {
    console.error('Supabase error creating template:', error);

    return;
  }
  if (data && data.length > 0) {
    revalidatePath('/dashboard/templates', 'page');
    redirect('/dashboard/templates');
  } else {
    // Handle the case where the update was successful but the data is not as expected
    console.error('Update successful, but data is not as expected');
  }
}
