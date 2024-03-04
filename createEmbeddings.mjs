// Import necessary modules
import { createClient } from '@supabase/supabase-js';
import OpenAI from "openai";
import 'dotenv/config'


// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fetch appointments from the database
const fetchAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');
    if (error) {
      throw new Error(`Error fetching appointments: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    return [];
  }
};

// Function to calculate and store embedding for each appointment
const calculateAndStoreEmbeddings = async () => {
    try {
        // Fetch appointments
    const appointments = await fetchAppointments();

    // Iterate through appointments
    for (const appointment of appointments) {
        // Extract content for embedding (assuming transcript)
        // const content = JSON.stringify(appointment.transcript);

        // Call OpenAI embed function    
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: appointment.combined_text,
            encoding_format: "float",
            dimensions: 512,
        });
        
        const embedding = response.data[0].embedding;
        
        // Update appointment with embedding
        const { data, error } = await supabase
        .from('appointments')
        .update({ embedding })
        .eq('id', appointment.id);

        if (error) {
            throw new Error(`Error updating appointment ${appointment.id}: ${error.message}`);
        }
    }
    console.log('Embeddings calculated and stored successfully');
  } catch (error) {
    console.error('Error calculating and storing embeddings:', error.message);
  }
}

// Call the function to calculate and store embeddings
calculateAndStoreEmbeddings();