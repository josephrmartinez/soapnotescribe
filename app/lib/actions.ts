'use server'

import Replicate from "replicate";
import OpenAI from "openai"
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createClientJS } from "@supabase/supabase-js";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";



const anthropic = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY })


export async function getReplicateMonoTranscript(url: string, apptid: string) {
  const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
  
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
    // Prediction may take longer than 30 seconds
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


export async function getSOAPData(noteid: string, transcript: string) {
  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY })
  
  console.log("Running getSOAPData")

  const systemContentString:string = `You are a helpful, highly-trained medical assistant. Carefully review the following TRANSCRIPT and generate a clinical SOAP note as a JSON object. The JSON object should conform to the following JSON Schema:

        {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "type": "object",
          "properties": {
            "appointment_date": {
              "type": "string",
              "format": "date",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
              "description": "Date of the appointment in yyyy-mm-dd format"
            },
            "appointment_time": {
              "type": "string",
              "pattern": "^\\d{2}:\\d{2}$",
              "description": "Time of the appointment in hh:mm format"
            },
            "allergies": {
              "type": "string",
              "description": "List of allergies, 'NKDA' if none"
            },
            "chief_complaint": {
              "type": "string",
              "maxLength": 50,
              "description": "Chief complaint. Capitalize the first letter of  the string"
            },
            "soap_subjective": {
              "type": "string",
              "description": "Subjective information from the patient"
            },
            "soap_objective": {
              "type": "string",
              "description": "Objective observations and measurements"
            },
            "soap_assessment": {
              "type": "string",
              "description": "Assessment and diagnosis"
            },
            "soap_plan": {
              "type": "string",
              "description": "Plan for treatment"
            },
            "differential_diagnosis": {
              "type": "string",
              "description": "Possible alternative diagnoses"
            },
            "appointment_type": {
              "type": "string",
              "enum": ["Telemedicine", "In Person"],
              "description": "Type of appointment: 'telemedicine' or 'in person'"
            },
            "appointment_specialty": {
              "type": "string",
              "enum": ["Addiction Medicine", "Behavioral Health", "Primary Care", "Urgent Care", "Wound Care", "IV Treatment", "Metabolic", "HRT", "Aesthetics", "Other"],
              "description": "Specialty of the appointment"
            },
            "patient_location": {
              "type": "string",
              "description": "Location of the patient (State/Province, e.g., 'Arizona')"
            }
          },
          "required": ["allergies"]
        }

        Your answer MUST begin and end with curly brackets. Do not include any leading backticks or other markers. Include as much specific information as possible from the transcript in the SOAP note. Be thorough! If you do not have the information required to provide a value in any of the fields, just return the JSON object WITHOUT those fields. For the differential_diagnosis field, analyze the entire transcript and return a differential diagnosis along with possible alternative treatment options. Your complete answer MUST begin and end with curly brackets.`

  const userContentString:string = `Give me a thorough SOAP note from the following transcript. Return your response as a JSON object. TRANSCRIPT: ${transcript}`
  

  try {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemContentString
      },
      { role: "user", content: userContentString },
    ],
    model: "gpt-4-turbo",
    response_format: { type: "json_object" },
  });

    const completionString = completion.choices[0].message.content as string
    const usage = completion.usage
    
    console.log("openai completionString", completionString);
    console.log("openai usage:", usage);


    const anthropicResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens:6000,
      system: systemContentString,
      messages: [
        {
          "role": "user",
          "content": userContentString
        }
      ]
    })

    console.log("anthropic response:", anthropicResponse)

  updateNoteWithSOAPData(noteid, transcript, completionString);

  } catch (error){
    console.log("Error getting OpenAI completion data:", error)
  }
  
}


// Update the appointment table row with the summary and feedback
async function updateNoteWithSOAPData(noteid: string, transcript: string, completion: string){
  console.log("Running updateNoteWithSOAPData");

  // Using service key to update appointment row
  const supabase = createClientJS(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  
  // const supabase = createClient()

  try {
    // Assumes 100% success rate returning object in correct format
    const completionObject = JSON.parse(completion);

    const { data, error, status } = await supabase
      .from('note')
      .update({
        status: "awaiting review",
        audio_transcript: transcript,
        ...completionObject
      })
      .eq('id', noteid)
      .select()
if (error) {
      throw new Error(`Error updating note in Supabase: ${error.message}`);
    }

    if (data) {
      console.log('Note updated successfully.');
      console.log('Updated note data status:', status);
    } else {
      throw new Error('No data returned from the update operation.');
    }
 } catch (error) {
    console.error('Error updating note:', error);
 }
}



