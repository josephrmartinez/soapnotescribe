'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'
import { Database } from '@/app/database.types';
import { unstable_noStore as noStore } from 'next/cache';
import { Appointment, Context } from './definitions';
import { embed } from './embed'



// const supabase = createServerComponentClient<Database>({ cookies })


const ITEMS_PER_PAGE = 6;


export const fetchUserSession = async () => {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession();
    console.log("session user id:", session?.user.id);
    return session;
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch user session.');
  }
};


export async function fetchFilteredAppointments(query: string, currentPage: number) {
  try {
    
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const supabase = createServerComponentClient({ cookies })
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(
        'id, patient, date, title, description, provider, clinic, summary, feedback'
      )
      .ilike('combined_text', `%${query}%`)
      .order('date', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch appointments data.');
    }

    return appointments;
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch appointments data.');
  }
}

// IN PROGRESS
export async function fetchSimilarApptsWithEmbedding(query: string, currentPage: number) {
  try {
    // console.log("query input", query)
    // const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const supabase = createServerComponentClient({ cookies })

    // CREATE EMBEDDING OF QUERY USING API CALL TO text-embedding-3-small	
    const embedding = await embed(query);

    // RUN SUPABASE EDGE FUNCTION 'MATCH_DOCUMENTS'
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding, // Pass the embedding you want to compare
      match_threshold: 0.2, // Choose an appropriate threshold for your data
      match_count: 6, // Choose the max number of matches
    })

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch appointments data.');
    }
    return documents;
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch appointments data.');
  }
}


export const getContext = async (
  message: string,
): Promise<Context[]> => {
  // Get the embeddings of the input message
  const embedding = await embed(message);

  const supabase = createServerComponentClient({ cookies })


  // RUN SUPABASE EDGE FUNCTION 'MATCH_DOCUMENTS'
  const { data: documents, error } = await supabase.rpc('match_appointments_advocatechat', {
    query_embedding: embedding, // Pass the embedding you want to compare
    match_threshold: 0.36, // Choose an appropriate threshold for your data
    match_count: 3, // Choose the max number of matches
  })
  
  return documents;
};



export async function fetchApptsPages(query: string) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
     const { data, count, error } = await supabase
       .from('appointments')
       .select('*', { count: 'exact', head: true })
       .ilike('combined_text', `%${query}%`)
 
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
     throw new Error('Failed to fetch appointments count.');
  }
 }


export async function fetchAppointmentById(id: string) {
  // EXPERIMENTAL. noStore() allows for immediate re-render of changed appointment data, but may lead to slower load times.
  noStore()
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch appointment data.');
    }

    const appointment = appointments ? appointments[0] : null;
    return appointment as Appointment;
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch appointment data.');
  }
}

export async function getSignedAudioUrl(patient: string, audio_url:string) {
  // return (`url path: ${patient}/${audio_url}`)
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase
      .storage
      .from('apptrecordings')
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
