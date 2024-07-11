'use server'

import { unstable_noStore as noStore, revalidatePath  } from 'next/cache';
import { Database } from '../database.types';
import { createClient } from '@/utils/supabase/server'
import { createClient as createClientJS } from "@supabase/supabase-js";

import { Note, NoteWithPatient, PatientForTable } from './definitions';
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
      patient (
        id,
        first_name,
        middle_name,
        last_name
      )`)
      // .ilike('audio_transcript', `%${query}%`)
      .order('appointment_date', { ascending: false });      

    if (error) {
      console.error('Error fetching notes:', error);
      return
    }

    // Implement custom sorting logic: processing at top, then "awaiting review", then "approved"
    notes.sort((a, b) => {
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

    const paginatedNotes = notes.slice(offset, offset + ITEMS_PER_PAGE);
    return paginatedNotes;

 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch appointments data.');
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
  return templates
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


export async function fetchPatientsWithQuery(query:string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
try {
    const supabase = createClient()
    const { data: patients, error } = await supabase
      .from('patient')
      .select(
        'id, first_name, middle_name, last_name'
      )
      .or(`first_name.ilike.%${query}%,middle_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .order('last_name', { ascending: true })

    if (error) {
      console.error('Error fetching patients:', error);
      return
    }
  // return patients as PatientForTable[]

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
        note(id, appointment_type, chief_complaint, appointment_date, appointment_specialty)`
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