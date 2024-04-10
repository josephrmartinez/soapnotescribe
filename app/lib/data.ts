'use server'

// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers'
// import { Database } from '@/app/database.types';
import { unstable_noStore as noStore } from 'next/cache';
import { Database } from '../database.types';
import { embed } from './embed'
import { createClient } from '@/utils/supabase/server'

// const supabase = createServerComponentClient<Database>({ cookies })


export async function fetchAppointmentById(id: string) {
  // EXPERIMENTAL. noStore() allows for immediate re-render of changed appointment data, but may lead to slower load times.
  noStore()
  try {
    const supabase = createClient()
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch appointment data.');
    }

    const appointment = appointments ? appointments[0] : null;
    return appointment
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch appointment data.');
  }
}

export async function getSignedAudioUrl(patient: string, audio_url:string) {
  // return (`url path: ${patient}/${audio_url}`)
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .storage
      .from('audiofiles')
      .createSignedUrl(`${patient}/${audio_url}`, 3600);

    if (error) {
      console.error('Supabase Storage Error:', error);
      throw new Error('Failed to get signed audio URL.');
    }

    // Assuming data is an object containing the signed URL
    const signedUrl = data?.signedUrl;

    return signedUrl;
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to get signed audio URL.');
  }
}


const ITEMS_PER_PAGE = 6;


// export const fetchUserSession = async () => {
//   try {
//     const supabase = createClient()
//     const { data: { session } } = await supabase.auth.getSession();
//     console.log("session user id:", session?.user.id);
//     return session;
//   } catch (error) {
//     console.error('Supabase Error:', error);
//     throw new Error('Failed to fetch user session.');
//   }
// };

// UPDATE
export async function fetchFilteredAppointments(query: string, currentPage: number) {
  noStore()
  try {
    
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const supabase = createClient()
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(
        'id, status, created_at, patient_name, appointment_date, chief_complaint, audio_transcript'
      )
      // .ilike('audio_transcript', `%${query}%`)
      .order('appointment_date', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (error) {
      console.error('Error fetching appointments:', error);
      return
    }

    // IMPLEMENT SUPABASE REALTIME UPDATES
    //   const subscription = supabase.realtime
    // .from('appointments')
    // .on('*', async () => {
    //     const { data: updatedAppointments, error: updateError } = await supabase
    //       .from('appointments')
    //       .select(
    //         'id, status, created_at, patient_name, appointment_date, chief_complaint, audio_transcript'
    //       )
    //       .order('appointment_date', { ascending: false })
    //       .range(offset, offset + ITEMS_PER_PAGE - 1);

    //     if (updateError) {
    //       console.error('Error updating appointments:', updateError);
    //       return;
    //     }

    // Implement custom sorting logic: processing at top, then "awaiting review", then "approved"
    // TODO: Update table to delineate these groupings?
    appointments.sort((a, b) => {
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

    return appointments;
 } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch appointments data.');
 }
}

// export async function fetchSimilarApptsWithEmbedding(query: string, currentPage: number) {
//   try {
//     // console.log("query input", query)
//     // const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//     const supabase = createClient()

//     // CREATE EMBEDDING OF QUERY USING API CALL TO text-embedding-3-small	
//     const embedding = await embed(query);

//     // RUN SUPABASE EDGE FUNCTION 'MATCH_DOCUMENTS'
//     const { data: documents, error } = await supabase.rpc('match_documents', {
//       query_embedding: embedding, // Pass the embedding you want to compare
//       match_threshold: 0.2, // Choose an appropriate threshold for your data
//       match_count: 6, // Choose the max number of matches
//     })

//     if (error) {
//       console.error('Supabase Error:', error);
//       throw new Error('Failed to fetch appointments data.');
//     }
//     return documents;
//   } catch (error) {
//     console.error('Supabase Error:', error);
//     throw new Error('Failed to fetch appointments data.');
//   }
// }


// export const getContext = async (
//   message: string,
// ): Promise<Context[]> => {
//   // Get the embeddings of the input message
//   const embedding = await embed(message);

//   const supabase = createClient()


//   // RUN SUPABASE EDGE FUNCTION 'MATCH_DOCUMENTS'
//   const { data: documents, error } = await supabase.rpc('match_appointments_advocatechat', {
//     query_embedding: embedding, // Pass the embedding you want to compare
//     match_threshold: 0.36, // Choose an appropriate threshold for your data
//     match_count: 3, // Choose the max number of matches
//   })
  
//   return documents;
// };



// export async function fetchApptsPages(query: string) {
//   try {
//     const supabase = createClient()
//      const { data, count, error } = await supabase
//        .from('appointments')
//        .select('*', { count: 'exact', head: true })
//        .ilike('combined_text', `%${query}%`)
 
//      if (error) {
//        console.error('Supabase Error:', error);
//        throw new Error('Failed to fetch appointments count.');
//      }
 
     
     
//      let totalPages = 1
//      if (count) {
//       totalPages = Math.ceil(count / ITEMS_PER_PAGE)
//     }
    
//       return totalPages;
//   } catch (error) {
//      console.error('Supabase Error:', error);
//      throw new Error('Failed to fetch appointments count.');
//   }
//  }

