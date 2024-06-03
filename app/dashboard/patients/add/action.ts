'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addPatient(formData: FormData) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('patient')
    .insert({
      first_name: formData.get('first_name') as string,
      middle_name: formData.get('middle_name') as string,
      last_name: formData.get('last_name') as string,
      date_of_birth: formData.get('date_of_birth') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address_street: formData.get('address_street') as string,
      address_unit: formData.get('address_unit') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipcode: formData.get('zipcode') as string,
      allergies: formData.get('allergies') as string,
      profile_notes: formData.get('profile_notes') as string,
    })
    .select();
  if (error) {
    console.error('Supabase error creating or updating patient:', error);

    return;
  }
  if (data && data.length > 0) {
    revalidatePath('/dashboard/patients', 'page');
    redirect('/dashboard/patients');
  } else {
    console.error('Update successful, but data is not as expected');
  }
}
