'use server'

import Replicate from "replicate";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import OpenAI from "openai"
import { createClient } from "@/utils/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createClientJS } from "@supabase/supabase-js";
// import { embed } from './embed'


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY })


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// THIS IS CAUSING THE INVARIANT COOKIES ERROR!
// const supabase = createClient()

interface Word {
  end: number;
  start: number;
  word: string;
}

interface Segment {
  end: string;
  start: string;
  text: string;
  words?: Word[];
  speaker: string;
}

interface TranscriptOutput {
  language: string;
  segments: Segment[];
  num_speakers: number;
}

function reformatTimestamps(transcriptOutput: TranscriptOutput): void {
  for (const segment of transcriptOutput.segments) {
    segment.start = secondsToHHMMSS(parseFloat(segment.start));
    segment.end = secondsToHHMMSS(parseFloat(segment.end));
  }
}

function secondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// OpenAI Whisper transcription
export async function getWhisperTranscript(formData: FormData) {
  const audioFile = formData.get('audio') as File
  
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text",
    });
    return transcription;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to transcribe audio');
  }
}


export async function getReplicateMonoTranscript(url: string, apptid: string) {
  const startTime = new Date()
  console.log("running getReplicateMonoTranscript", startTime);

  let webhookUrl;

  if (process.env.NODE_ENV === 'production') {
      webhookUrl = process.env.PROD_REPLICATE_WEBHOOK;
  } else {
      webhookUrl = process.env.DEV_REPLICATE_WEBHOOK;
  }
  console.log("webhook url:", webhookUrl)

  try {
  replicate.predictions.create(
    {
      version: "3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
      input: {
        task: "transcribe",
        audio: url,
        language: "None",
        timestamp: "chunk",
        batch_size: 64,
        diarise_audio: false
      },
      webhook: `${webhookUrl}?apptid=${apptid}`,
      webhook_events_filter: ["completed"]
    });
  
} catch (error) {
  console.error("Error in getTranscript:", error);
  // Handle error appropriately
}
}


// Run Replicate model to create diarized transcription from audio url
export async function getReplicateDiarizedTranscript(url: string, apptid: string) {
  const startTime = new Date()
  console.log("running getTranscript", startTime);

  let webhookUrl;

  if (process.env.NODE_ENV === 'production') {
      webhookUrl = process.env.PROD_REPLICATE_WEBHOOK;
  } else {
      webhookUrl = process.env.DEV_REPLICATE_WEBHOOK;
  }
  console.log("webhook url:", webhookUrl)

  try {
  const prediction = await replicate.predictions.create(
    {
      version: "7fa6110280767642cf5a357e4273f27ec10ebb60c107be25d6e15f928fd03147",
      input: {
        file_url: url,
      },
      webhook: `${webhookUrl}?apptid=${apptid}`,
      webhook_events_filter: ["completed"]
    });

    const endTime = new Date()
    const runTime = (endTime.getTime() - startTime.getTime())
    console.log("prediction runtime:", runTime);

    console.log("replicate prediction:", prediction)
  
} catch (error) {
  console.error("Error in getTranscript:", error);
  // Handle error appropriately
}
}


// Update the appointment table row with the transcript
export async function updateApptWithTranscript(apptid: string, transcript: string){
  console.log("Running updateApptWithTranscript")

  // Using service key to update appointment row
  // const supabase = createClientJS(process.env.SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_KEY!)

  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ audio_transcript: transcript })
      .eq('id', apptid)
      .select();

    if (error) {
      console.error(`Error updating transcript for appointment ID ${apptid}:`, error);
      throw new Error(`Error updating transcript for appointment ID ${apptid}: ${error.message}`);
    }

    console.log(`Transcript updated successfully for appointment ID ${apptid}:`, data);
    getSOAPData(apptid, transcript)
    return data;
 } catch (error) {
    console.error(`Failed to update transcript for appointment ID ${apptid}:`, error);
    throw error; // Rethrow the error to be handled by the caller
 }
}



export async function deleteNote(id: string) {

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to fetch note data.');
  }
  console.log("Note deleted successfully");
  revalidatePath('/dashboard/notes');
  redirect('/dashboard/notes')
}

export async function getSOAPData(apptid: string, transcript: string) {
  console.log("Running getSOAPData")
  try {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful and highly trained medical assistant. You will carefully review the following TRANSCRIPT and generate a clinical SOAP note as a JSON object with the following structure:
        {
          patient_name: string;
          patient_date_of_birth: Date;
          appointment_date: Date ("yyyy-mm-dd");
          appointment_time: string ("hh:mm");
          allergies: string ("NKDA" if none);
          chief_complaint?: string (max 50 characters, capitalize first character);
          soap_subjective?: string;
          soap_objective?: string;
          soap_assessment?: string;
          soap_plan?: string;
          second_opinion?: string;
        } Your answer MUST begin and end with curly brackets. Do not include any leading backticks or other markers. Include as much specific information as possible from the transcript in the SOAP note. Be thorough! If you do not have the information required to provide a value in one of the fields, just return the JSON object with an empty string or null value for that field. For the second_opinion field, analyze the entire transcript and suggest possible alternative treatment options. Your answer MUST begin and end with curly brackets.`
      },
      { role: "user", content: `TRANSCRIPT: ${transcript}` },
    ],
    // model: "gpt-3.5-turbo-1106",
    model: "gpt-4-turbo",
    response_format: { type: "json_object" },
  });

    const completionString = completion.choices[0].message.content as string
    
    console.log("completionString", completionString)

  updateApptWithSOAPData(apptid, transcript, completionString);

  } catch (error){
    console.log("Error getting OpenAI completion data:", error)
  }
  
}


// Update the appointment table row with the summary and feedback
async function updateApptWithSOAPData(apptid: string, transcript: string, completion: string){
  console.log("Running updateApptWithSOAPData");

  // Using service key to update appointment row
  const supabase = createClientJS(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  
  // const supabase = createClient()

  try {
    const completionObject = JSON.parse(completion);


    const { data, error, status } = await supabase
      .from("appointments")
      .update({
        status: "awaiting review",
        audio_transcript: transcript,
        ...completionObject
      })
      .eq('id', apptid)
      .select()
if (error) {
      throw new Error(`Error updating appointment in Supabase: ${error.message}`);
    }

    if (data) {
      console.log('Appointment updated successfully.');
      console.log('Updated appointment data status:', status);
    } else {
      throw new Error('No data returned from the update operation.');
    }
 } catch (error) {
    console.error('Error updating appointment:', error);
 }
}










// export async function formatReplicateReponse(apptid: string, output: TranscriptOutput) {
//   console.log("Running formatReplicateReponse")
//   output.segments.forEach((segment) => delete segment.words);
//   reformatTimestamps(output)
//   await updateApptWithTranscript(apptid, output);
// }

// // UPDATE appointment transcript, no subsequent AI API call
// export async function updateApptTranscript(apptid: string, transcript: object){
//   console.log("Running updateApptTranscript")
//   const { data, error } = await supabase
//   .from("appointments")
//   .update({transcript: transcript})
//   .eq('id', apptid)
//   .select();

// if (error) {
//   console.error("Error adding transcript:", error);
//   // Handle error accordingly
// } else {
//   console.log("Transcript added successfully:", data);
// }
// }


// // Send transcript to OpenAI model for summarization and feedback
// async function getSummaryAndFeedback(apptid: string, transcript: object) {
//   console.log("Running getSummaryAndFeedback")
//   try {
//   const transcriptString = JSON.stringify(transcript);
//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: "You are a helpful and highly trained medical assistant designed to output a JSON object with a 'summary' and critical 'feedback' of a medical appointment audio transcript. This JSON object should contain two keys: 'summary' and 'feedback'. The corresponding values should be strings of at least 400 words.",
//       },
//       { role: "user", content: `TRANSCRIPT: ${transcriptString}` },
//     ],
//     model: "gpt-3.5-turbo-1106",
//     response_format: { type: "json_object" },
//   });

  
//   try {
//     const responseContentString = completion.choices[0].message.content as string;
  
//     if (responseContentString) {
//       const responseContent = JSON.parse(responseContentString);
  
//       if (typeof responseContent === 'object' && responseContent !== null) {
//         const { summary = "", feedback = "" } = responseContent;
//         await updateApptWithSummaryAndFeedback(apptid, summary, feedback);
//       } else {
//         // Handle the case where responseContent is not an object
//       }
//     } else {
//       // Handle the case where responseContentString is null or empty
//     }
//   } catch (error) {
//     // Handle the case where JSON parsing fails
//     console.error("Error parsing JSON content:", error);
//   }
//   } catch (error){
//     console.log("Error getting summary and feedback:", error)
//   }
// }


// // Update the appointment table row with the summary and feedback
// async function updateApptWithSummaryAndFeedback(apptid: string, summary: string, feedback: string){
//   console.log("Running updateApptWithSummaryAndFeedback")
//   const { data, error } = await supabase
//   .from("appointments")
//   .update({summary: summary, feedback: feedback})
//   .eq('id', apptid)
//   .select();

// if (error) {
//   console.error("Error adding summary and feedback:", error);
//   // Handle error accordingly
// } else {
//   // console.log("Summary and feedback added successfully:", data);
// }
// }








// export async function deleteAppt(apptid: string){
//   console.log("Running delete")
//   const { error } = await supabase
//   .from("appointments")
//   .delete()
//   .eq('id', apptid)

// if (error) {
//   console.error("Error deleting appointment:", error);
//   // Handle error accordingly
// } else {
//   console.log("Appointment deleted successfully");
//   revalidatePath('/dashboard/appointments');
//   redirect('/dashboard/appointments');
// }
// }






