'use server'

import { unstable_noStore as noStore, revalidatePath  } from 'next/cache';
import { Database } from '../database.types';
import { createClient } from '@/utils/supabase/server'
import { createClient as createClientJS } from "@supabase/supabase-js";

import { Note, NoteWithPatient, PatientForTable, NoteForTable, Template } from './definitions';
import { redirect } from 'next/navigation';

const ITEMS_PER_PAGE = 6;

// UPDATE TO ALWAYS DISPLAY PROCESSING NOTES (AUDIO_TRANSCRIPT IS NULL)
// REFACTOR TO GET ONLY NEEDED NOTES. FILTERING EARLIER.


export async function fetchFilteredNotes(query: string, currentPage: number) {
  noStore()
  try {
    
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const supabase = createClient()
    const { data: notes, error } = await supabase
      .from('note')
      .select(`
      id,
      chief_complaint,
      status, 
      appointment_date,
      patient(
        id,
        first_name,
        middle_name,
        last_name
      )`)
      // .or(`chief_complaint.ilike.%${query}%, status.ilike.%${query}%`)
      .order('appointment_date', { ascending: false });      

    if (error) {
      console.error('Error fetching notes:', error);
      return
    }

    const notesFiltered = notes.filter(note => 
      note.patient.first_name?.toLowerCase().includes(query.toLowerCase())
      || note.patient.middle_name?.toLowerCase().includes(query.toLowerCase())
      || note.patient.last_name?.toLowerCase().includes(query.toLowerCase())
      || note.chief_complaint?.toLowerCase().includes(query.toLowerCase())
      || note.status?.toLowerCase().includes(query.toLowerCase())
      || (note.patient.first_name?.toLowerCase() + ' ' + note.patient.last_name?.toLowerCase()).includes(query.toLowerCase())
    )
    


    // Implement custom sorting logic: processing at top, then "awaiting review", then "approved"
    notesFiltered.sort((a, b) => {
      // Prioritize "processing" status
      if (a.status === 'processing' && b.status !== 'processing') {
        return -1;
      } else if (a.status !== 'processing' && b.status === 'processing') {
        return 1;
      }

      // Then prioritize "awaiting review" status
      if (a.status === 'awaiting review' && b.status !== 'awaiting review') {
        return -1;
      } else if (a.status !== 'awaiting review' && b.status === 'awaiting review') {
        return 1;
      }

      // Then prioritize "draft" status (same as above)
      if (a.status === 'draft' && b.status !== 'draft') {
        return -1;
      } else if (a.status !== 'draft' && b.status === 'draft') {
        return 1;
      }

      // Finally, sort by status and then by appointment_date
      if (a.status === b.status) {
        // If both appointments have the same status, sort by appointment_date
        // Since we know there will be no null appointment_date values, we can directly create Date objects
        const aDate = new Date(a.appointment_date);
        const bDate = new Date(b.appointment_date);
        return bDate.getTime() - aDate.getTime(); // Sort in descending order
    }

      // Default return value if none of the above conditions are met
      return 0;
    });


    const paginatedNotes = notesFiltered.slice(offset, offset + ITEMS_PER_PAGE);
    const totalCount = notesFiltered.length || 1;

    let totalPages = 1
     if (totalCount) {
      totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
    }

    return { paginatedNotes, totalPages };

 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch appointments data.', error);
 }
}

export async function fetchNotesPages(query: string) {
  try {
    const supabase = createClient()
     const { data, count, error } = await supabase
       .from('note')
       .select('*', { count: 'exact', head: true })
      //  .ilike('combined_text', `%${query}%`)
 
     if (error) {
       console.error('Supabase Error:', error);
       throw new Error('Failed to fetch appointments count.');
     }
     let totalPages = 1
     if (count) {
      totalPages = Math.ceil(count / ITEMS_PER_PAGE)
    }
    
      return totalPages;
  } catch (error) {
     console.error('Supabase Error:', error);
     throw new Error('Failed to fetch notes count.');
  }
 }


export async function fetchNoteById(id: string) {
  try {
    const supabase = createClient();
    const { data: notes, error } = await supabase
      .from('note')
      .select(`
      *,
      patient (
        id,
        email,
        date_of_birth,
        allergies,
        phone,
        provider,
        profile_notes,
        first_name,
        last_name,
        address_street,
        address_unit,
        state,
        city,
        zipcode
      )`)
      .eq('id', id);

    if (error) {
      throw new Error('Supabase Error: ' + error.message);
    }

    const note = notes ? notes[0] : null;
    if (!note) {
      throw new Error(`Note with ID ${id} not found.`);
    }

    return note as NoteWithPatient
  } catch (error) {
    console.error('Error fetching note:', error);
    throw new Error('Failed to fetch note data.');
  }
}

export async function getSignedPdfUrl(userId: string, patientLastName: string, patientFirstName: string, appointmentDate: string) {
  try {
    const supabase = createClient();
    const filePath = `${userId}/${patientLastName} ${patientFirstName}/${appointmentDate}.pdf`;
    console.log("file path:", filePath)

    const { data, error } = await supabase.storage
      .from('pdfs')
      .createSignedUrl(filePath, 60);
    if (error) {
      console.error('Error getting pdf:', error);
    }

    const signedPdfUrl = data?.signedUrl;

    return signedPdfUrl

  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to get signed PDF URL.');
  }
} 

export async function getSignedAudioUrl(userId: string, audio_url:string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .storage
      .from('audiofiles')
      .createSignedUrl(`${userId}/${audio_url}`, 3600);

    if (error) {
      console.error('Supabase Storage Error:', error);
      throw new Error('Failed to get signed audio URL.');
    }

    const signedUrl = data?.signedUrl;

    return signedUrl;
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to get signed audio URL.');
  }
}

export const fetchUserSession = async () => {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch user session.');
  }
};

export async function fetchTemplates() {
  noStore()
  try {
    const supabase = createClient()
    const { data: templates, error } = await supabase
      .from('template')
      .select(
        '*'
      )

    if (error) {
      console.error('Error fetching templates:', error);
      return
    }
  return templates as Template[]
 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch templates data.');
 }
}


export async function fetchTemplateById(id: string) {
  noStore()
  try {
    const supabase = createClient()
    const { data: templates, error } = await supabase
      .from('template')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch template data.');
    }

    const template = templates ? templates[0] : null;
    return template
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch template data.');
  }
}

export async function fetchPatients() {
  noStore();
try {
    const supabase = createClient()
    const { data: patients, error } = await supabase
      .from('patient')
      .select(
        'id, first_name,  middle_name, last_name, email, phone, address_street, address_unit, city, state, zipcode, country, provider, date_of_birth, allergies, profile_notes'
      )
      // .ilike('audio_transcript', `%${query}%`)
      .order('last_name', { ascending: true })

    if (error) {
      console.error('Error fetching patients:', error);
      return
    }
  return patients
 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch paients data.');
 }
}

export async function fetchPatientsWithSameName(first_name: string, last_name: string) {
  try {
    const supabase = createClient()
    const { data: patients, error } = await supabase
      .from('patient')
      .select(
        'id, first_name, middle_name, last_name, date_of_birth'
      )
      .eq('first_name', first_name)
      .eq('last_name', last_name)

    if (error) {
      console.error('Error fetching patients by name:', error);
      throw new Error('Failed to fetch patients by name data')
    }
  
    return patients
  
 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch patients by name data.');
 }
}



export async function checkForExistingPatient(formData: FormData) {
  let first_name = formData.get('first_name') as string;
  let last_name = formData.get('last_name') as string;


  let patientsWithSameName = await fetchPatientsWithSameName(first_name, last_name);
  
  if (patientsWithSameName.length > 0) {
    return {exists: true, patients: patientsWithSameName}
  } else { 
    await addPatient(formData);
    return { exists: false }
   }
}

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
      country: formData.get('country') as string,
      zipcode: formData.get('zipcode') as string,
      allergies: formData.get('allergies') as string,
      referral_source: formData.get('referral_source') as string,
      profile_notes: formData.get('profile_notes') as string,
      pharmacy_name: formData.get('pharmacy_name') as string,
      pharmacy_phone: formData.get('pharmacy_phone') as string,
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


export async function editPatient(formData: FormData) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('patient')
    .update({
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
      country: formData.get('country') as string,
      zipcode: formData.get('zipcode') as string,
      allergies: formData.get('allergies') as string,
      referral_source: formData.get('referral_source') as string,
      profile_notes: formData.get('profile_notes') as string,
      pharmacy_name: formData.get('pharmacy_name') as string,
      pharmacy_phone: formData.get('pharmacy_phone') as string,
    })
    .eq('id', formData.get('id'))
    .select();
  if (error) {
    console.error('Supabase error creating or updating patient:', error);

    return;
  }
  if (data && data.length > 0) {
    revalidatePath('/dashboard/patients', 'page');
    redirect('/dashboard/patients');
  } else {
    // Handle the case where the update was successful but the data is not as expected
    console.error('Update successful, but data is not as expected');
  }
}



export async function fetchPatientsWithQuery(query:string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
try {
    const supabase = createClient()
    const { data: patients, error } = await supabase
      .from('patient')
      .select(
        'id, first_name, middle_name, last_name, date_of_birth'
      )
      .or(`first_name.ilike.%${query}%,middle_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .order('last_name', { ascending: true })

    if (error) {
      console.error('Error fetching patients:', error);
      return
    }
  

  const paginatedPatients = patients.slice(offset, offset + ITEMS_PER_PAGE);
  return paginatedPatients as PatientForTable[];
  
 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch paients data.');
 }
}



export async function countPatientPagesWithQuery(query:string) {
  noStore();
  
try {
    const supabase = createClient()
    const { count: totalPatients, error: countError } = await supabase
      .from('patient')
      .select(
        'id', { count: 'exact', head: true}
      )
      .or(`first_name.ilike.%${query}%,middle_name.ilike.%${query}%,last_name.ilike.%${query}%`)

    if (countError) {
      console.error('Error counting patients:', countError);
      return
    }
  
  let pages:number = 0
  if (totalPatients) {
      pages = Math.ceil(totalPatients / ITEMS_PER_PAGE)
    }
    
      return pages;
  
  
 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch paients data.');
 }
}


export async function fetchPatientCount() {
try {
    const supabase = createClient()
  // const { data: count, error } = await supabase
  //   .from('patient')
  //   .select('*', { count: 'exact', head: true });
  const { data, error } = await supabase
    .from('patient')
    .select('id');

  if (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch paient count.');
  }
  // console.log("patient count:", data.length)
  return data.length;
} catch (error) {
  console.error('Unexpected Error:', error);
    throw new Error('Failed to fetch patient count due to an unexpected error.');
  }
}

export async function getPatientDOBFromNoteId(id: string) {
  
}

export async function fetchPatientById(id: string) {
  // EXPERIMENTAL. noStore() allows for immediate re-render of changed appointment data, but may lead to slower load times.
  noStore()
  try {
    const supabase = createClient()
    const { data: patients, error } = await supabase
      .from('patient')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch patient data.');
    }

    const patient = patients ? patients[0] : null;
    return patient
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch patient data.');
  }
}

export async function fetchPatientProfileById(id: string) {
  // EXPERIMENTAL. noStore() allows for immediate re-render of changed appointment data, but may lead to slower load times.
  noStore()
  try {
    const supabase = createClient()
    const { data: patients, error } = await supabase
      .from('patient')
      .select(`*, 
        note(id, appointment_type, chief_complaint, appointment_date, appointment_specialty, status)`
      )
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch patient data.');
    }

    const patient = patients ? patients[0] : null;

    return patient
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch patient data.');
  }
}

export async function fetchUserSettings() {
  noStore();
  try {
    const supabase = createClient()
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')

    if (error) {
      console.error('Error fetching user settings:', error);
      return
    }
    
    return settings[0];
 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch user settings data.');
 }
}



// export async function getUserSettingsFromNoteId(noteId:string) {
//   noStore();
//   try {
//       // Using service key:
//       const supabase = createClientJS(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
//     const { data: userIdData, error: userIdError } = await supabase
//       .from('note')
//       .select('user_id')
//       .eq('id', noteId)
//       .single();

//     if (userIdError) {
//       console.error('Error fetching user ID:', userIdError);
//       throw userIdError;
//     }

//     const userId = userIdData?.user_id;
//     if (!userId) {
//       console.error('User ID not found for note ID:', noteId);
//       return null;
//     }
    
//     const { data: settingsData, error: settingsError } = await supabase
//       .from('user_settings')
//       .select('*')
//       .eq('user_id', userId)
//       .single();
    
//     if (settingsError) {
//       console.error('Error fetching user settings:', settingsError);
//       throw settingsError;
//     }

    
//     return settingsData;

//  } catch (error) {
//     console.error('Supabase Error:', error);
//     throw new Error('Failed to fetch user settings data.');
//  }
// }


export async function updateUserSettings(payload: any, userId: string) {
  noStore();
  console.log("calling updateUserSettings with payload:", payload);
  const supabase = createClient()
  const { error }  = await supabase
      .from('user_settings')
      .update(payload)
      .eq('user_id', userId)

  if (error) {
    console.log("Error updating user settings:", error);
  }
  }
  




export async function deleteNote(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('note')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note from Supabase:', error);
    throw new Error('Failed to delete the note.');
  }

  console.log('Note deleted successfully');
  revalidatePath('/dashboard/notes');
  redirect('/dashboard/notes'); 
}


