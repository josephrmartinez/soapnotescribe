'use server'

import Replicate from "replicate";
import OpenAI from "openai"
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createClientJS } from "@supabase/supabase-js";
import { fetchUserSettings, } from "./data";
import { getUserSettingsFromNoteId } from "./data";


function assertIsTextBlock(value: unknown): asserts value is Anthropic.TextBlock {
  if (typeof value === "object" && value && !value.hasOwnProperty("text")) throw new Error('Expected text block');
}


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


export async function getSOAPData(noteid: string, transcript: string, transcriptionTime: string) {

  const userSettings = await getUserSettingsFromNoteId(noteid)
  const appointmentTypes = JSON.stringify(userSettings.appointment_types);
  const appointmentSpecialties = JSON.stringify(userSettings.appointment_specialties);


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
            "allergies?": {
              "type": "string",
              "description": "Drug allergies. Only return a value for this field if drug allergies are mentioned."
            },
            "chief_complaint": {
              "type": "string",
              "maxLength": 50,
              "description": "Chief complaint. Capitalize the first letter of the string"
            },
            "soap_subjective": {
              "type": "string",
              "description": "Subjective information from the patient"
            },
            "soap_objective": {
              "type": "string",
              "description": "Objective observations and measurements. Narrative format or UNORDERED list."
            },
            "soap_assessment": {
              "type": "string",
              "description": "Assessment and diagnosis. Narrative format or UNORDERED list."
            },
            "soap_plan": {
              "type": "string",
              "description": "Plan for treatment and patient education. Narrative format or UNORDERED list."
            },
            "differential_diagnosis": {
              "type": "string",
              "description": "Differential diagnosis. Narrative format or UNORDERED list."
            },
            "appointment_type?": {
              "type": "string",
              "enum": ${appointmentTypes},
              "description": "Type of appointment. Only return a value for this field if appointment type is clear."
            },
            "appointment_specialty?": {
              "type": "string",
              "enum": ${appointmentSpecialties},
              "description": "Specialty of the appointment. Only return a value for this field if appointment specialty is clear."
            },
            "patient_location?": {
              "type": "string",
              "description": "Location of the patient (State/Province, e.g., 'Arizona'). Only return a value for this field if the patient location is clearly mentioned."
            }
          }
        }

        Your answer MUST begin and end with curly brackets. Do not include any leading backticks or other markers. ALL LISTS SHOULD BE UNORDERED AND STYLED WITH A SIMPLE DASH. NO NUMBERED LISTS. Include as much specific information as possible from the transcript in the SOAP note. Be thorough! If you do not have the information required to provide a value in any of the fields, just return the JSON object WITHOUT those fields. Do not return a field with an empty string or an "unknown" value. For the differential_diagnosis field, analyze the entire transcript and return a differential diagnosis along with possible alternative treatment options. Your complete answer MUST begin and end with curly brackets.`
  const userContentString:string = `Give me a thorough SOAP note from the following transcript. Return your response as a JSON object. TRANSCRIPT: ${transcript}`
  
  // console.log("system content string:", systemContentString)

  try {
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // const completion = await openai.chat.completions.create({
  //   messages: [
  //     {
  //       role: "system",
  //       content: systemContentString
  //     },
  //     { role: "user", content: userContentString },
  //   ],
  //   model: "gpt-4-turbo",
  //   response_format: { type: "json_object" },
  // });

  //   const completionString = completion.choices[0].message.content as string
  //   const usage = completion.usage
  //   const inputTokens = usage?.prompt_tokens;
  //   const outputTokens = usage?.completion_tokens

  //   const openAICost = ((inputTokens / 1000 * 0.01) + (outputTokens / 1000 * 0.03)).toFixed(3)

  //   console.log("openai completionString", completionString);
  //   console.log("openai cost:", openAICost);


    const anthropicResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: systemContentString,
      messages: [
        {
          "role": "user",
          "content": userContentString
        }
      ]
    })


    assertIsTextBlock(anthropicResponse.content[0]);
    // console.log("anthropic response:", anthropicResponse.content[0].text)

    const anthropicCompletionString = anthropicResponse.content[0].text


    const anthropicInputTokens = anthropicResponse.usage.input_tokens
    const anthropicOutputTokens = anthropicResponse.usage.output_tokens
    const analysisCost:string = ((anthropicInputTokens / 1000 * 0.003) + (anthropicOutputTokens / 1000 * 0.015)).toFixed(3) //claude-3-5-sonnet-20240620

    // console.log("anthropic cost:", anthropicCost)

      updateNoteWithSOAPData(noteid, transcript, transcriptionTime, anthropicCompletionString, analysisCost);
    
  // updateNoteWithSOAPData(noteid, transcript, completionString);

  } catch (error){
    console.log("Error getting completion data:", error)
  }
  
}


// Update the appointment table row with the structured data
async function updateNoteWithSOAPData(noteid: string, transcript: string, transcriptionTime:string, completion: string, analysisCost:string){
  console.log("Running updateNoteWithSOAPData");


  const formattedAnalysisCost = parseFloat(analysisCost);

  // Replicate pricing for model running on Nvidia A40 (Large) GPU hardware, which costs $0.000725 per second.
const transcriptionCost = Number((0.000725 * Number(transcriptionTime)).toFixed(6));
   

  console.log("transcriptionCost:", transcriptionCost)
  console.log("formattedAnalysisCost", formattedAnalysisCost)
  console.log("transcriptionTime", transcriptionTime)

  // Using service key to update appointment row
  const supabase = createClientJS(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  

  try {
    // Assumes 100% success rate returning object in correct format
    console.log("completion obj to parse:", completion)
    const completionObject = JSON.parse(completion);

    const { data, error, status } = await supabase
      .from('note')
      .update({
        status: "awaiting review",
        audio_transcript: transcript,
        transcription_time: transcriptionTime,
        transcription_cost: transcriptionCost,
        analysis_cost: formattedAnalysisCost,
        ...completionObject
      })
      .eq('id', noteid)
      .select()
if (error) {
      throw new Error(`Error updating note in Supabase: ${error.message}`);
    }

    if (data) {
      console.log('Note updated successfully.', data);
      // console.log('Updated note data status:', status);
    } else {
      throw new Error('No data returned from the update operation.');
    }
 } catch (error) {
    console.error('Error updating note:', error);
 }
}



