'use server'

import Replicate from "replicate";
import OpenAI from "openai"
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createClientJS } from "@supabase/supabase-js";

const modelPricing = {
    "gpt-4": {
        "input_token_cost": 0.03,
        "output_token_cost": 0.06
    },
    "gpt-4-turbo": {
        "input_token_cost": 0.01,
        "output_token_cost": 0.03
    },
    "gpt-4o": {
        "input_token_cost": 0.005,
        "output_token_cost": 0.015
    },
    "gpt-4o-mini": {
        "input_token_cost": 0.00015,
        "output_token_cost": 0.0006
    },
    "gpt-3.5-turbo": {
        "input_token_cost": 0.0005,
        "output_token_cost": 0.0015
    },
    "claude-3-haiku-20240307": {
        "input_token_cost": 0.00025,
        "output_token_cost": 0.00125
    },
    "claude-3-5-sonnet-20240620": {
        "input_token_cost": 0.003,
        "output_token_cost": 0.015
    },
    "claude-3-opus-20240229": {
        "input_token_cost": 0.015,
        "output_token_cost": 0.075
    }
}

const medications:string[] = [
    "Aspirin",
    "Acetaminophen",
    "Ibuprofen",
    "Naproxen",
    "Flexeril",
    "Hydrocodone",
    "Oxycodone",
    "Tramadol",
    "Lidocaine",
    "Epinephrine",
    "Nitroglycerin",
    "Albuterol",
    "Prednisone",
    "Dexamethasone",
    "Amoxicillin",
    "Azithromycin",
    "Cephalexin",
    "Ciprofloxacin",
    "Metronidazole",
    "Clindamycin",
    "Lorazepam",
    "Diazepam",
    "Midazolam",
    "Fentanyl",
    "Morphine",
    "Ondansetron",
    "Promethazine",
    "Diphenhydramine",
    "Hydrocortisone",
    "Ipratropium",
    "Atropine",
    "Naloxone",
    "Flumazenil",
    "Metoprolol",
    "Lisinopril",
    "Losartan",
    "Hydrochlorothiazide",
    "Simvastatin",
    "Warfarin",
    "Heparin",
    "Insulin",
    "Glucagon",
    "Nitrofurantoin",
    "Sulfamethoxazole/Trimethoprim",
    "Chlorhexidine",
    "Ranitidine",
    "Omeprazole",
    "Pantoprazole"
]

const systemContentString:string = `As a highly skilled medical assistant, your task is to meticulously review the provided TRANSCRIPT and craft a clinical SOAP note in the form of a JSON object. Please adhere strictly to the following guidelines:
- Ensure all lists within the SOAP note are unordered, formatted with a simple dash (-). Avoid using numbered lists.
- Incorporate as much detailed information as possible from the transcript into the SOAP note. Thoroughness is key, but do not make up information that is not in the transcript!
- If certain information required for any fields is missing from the transcript, exclude those fields from the JSON object entirely. Do not include fields with empty strings or "unknown" values.
- The transcript may not explicitly mention differential diagnoses. As an expert, you are expected to formulate a differential diagnosis based on the transcript information. Always include a differential diagnosis along with alternative treatment recommendations in your SOAP note.
- Be vigilant for formatting and spelling errors in the transcript, particularly regarding prescription medications. Here is a list of common medication names: ${medications} . The transcript may include misspellings of these or other medications. Be sure to provide the correct spelling. Correct medication dosage transcriptions by standardizing the format to use a slash ("/") between different ingredient amounts. Convert verbal expressions of dosage, such as "five slash three twenty-five milligrams" or "five milligrams and three hundred twenty-five milligrams," to the format "5/325 milligrams." Ensure the correct separation of amounts and units according to standard prescription practices.
Your expertise and attention to detail will ensure the generation of a comprehensive and accurate SOAP note.`

const JSON_schema = {
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
            "chief_complaint": {
              "type": "string",
              "maxLength": 50,
              "description": "Chief complaint. Capitalize the first letter of the string"
            },
            "soap_subjective": {
              "type": "string",
              "description": "SOAP note subjective including any of the following: History of the present illness including onset, palliating/provoking factors, quality, region/radiation, severity/associated symptoms, and time course (OPQRST); pertinent medical, surgical, family, and social history; current medications with doses and frequency. DO NOT include patient name or date of birth."
            },
            "soap_objective": {
              "type": "string",
              "description": "Objective observations and measurements. Narrative format or UNORDERED list. DO NOT include patient name or date of birth."
            },
            "soap_assessment": {
              "type": "string",
              "description": "Assessment and diagnosis. Narrative format or UNORDERED list. NO DIFFERENTIAL DIAGNOSIS in this field."
            },
            "soap_plan": {
              "type": "string",
              "description": "Plan for treatment and patient education. Narrative format or UNORDERED list. Be sure to correct spelling and formatting of medications."
            },
            "differential_diagnosis": {
              "type": "string",
              "description": "Differential diagnosis and alternative treatment plan. Narrative format or UNORDERED list. ALWAYS INCLUDE."
            },
            "patient_location": {
              "type": "string",
              "description": "Location of the patient (State/Province, e.g., 'Arizona'). Only include this key if the patient location is clearly mentioned in the transcript."
            }
          }
        }

function generateUserContentString(transcript: string) {
    return `Generate a thorough SOAP note from the following transcript. Return your response as a JSON object in the specified schema. TRANSCRIPT: ${transcript}`
  }

function assertIsTextBlock(value: unknown): asserts value is Anthropic.TextBlock {
  if (typeof value === "object" && value && !value.hasOwnProperty("text")) throw new Error('Expected text block');
}





export async function getReplicateMonoTranscript(url: string, apptid: string) {
  const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
  
  const webhookUrl = process.env.NODE_ENV === 'production' ? process.env.PROD_REPLICATE_WEBHOOK : process.env.DEV_REPLICATE_WEBHOOK;

  // console.log(`Running getReplicateMonoTranscript at ${new Date().toISOString()}`);
  
  try {
    // Prediction may take longer than 30 seconds
    const response = await replicate.predictions.create(
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
    // console.log("Replicate prediction request acknowledged:", response);
  
} catch (error) {
  console.error("Error sending Replicate response:", error);
}
}


export async function getAnalysisAnthropic(noteid: string, transcript: string, transcriptionTime: string) {
  console.log("calling getAnalysisAnthropic")

  const userContentString: string = generateUserContentString(transcript);

  const model = "claude-3-5-sonnet-20240620"

  try {
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
    }

    const anthropic = new Anthropic({ apiKey });
    
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      system: systemContentString,
      messages: [
        {
          "role": "user",
          "content": userContentString
        }
      ],
      temperature: 1,
      tool_choice: { type: "tool", name: "JSON_SOAP_note" },
      tools: [{
        name: "JSON_SOAP_note",
        description: "Clinical SOAP note as a JSON object",
        input_schema: JSON_schema
      }]
    })

    console.log("anthropic response:", response)

    const toolUseBlock = response.content[0];

    const soapNote = toolUseBlock.input

    

    const usage = response.usage;

    if (!usage) return;

    const inputTokens = usage.input_tokens;
    const outputTokens = usage.output_tokens;
    const pricing = modelPricing[model]
    const inputCost = pricing['input_token_cost']
    const outputCost = pricing['output_token_cost']

    const analysisCost:string = ((inputTokens / 1000 * inputCost) + (outputTokens / 1000 * outputCost)).toFixed(3)

    console.log("anthropic cost:", analysisCost)

    await updateNoteWithSOAPData(noteid, transcript, transcriptionTime, soapNote, analysisCost);
    
  } catch (error){
    console.log("Error getting completion data:", error)
  }
  
}


export async function getAnalysisOpenAI(noteid: string, transcript: string, transcriptionTime: string) {
  console.log("calling getAnalysisOpenAI")

  const userContentString: string = generateUserContentString(transcript);
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const model = "gpt-4o-mini"

    const openAIcompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemContentString
        },
        { role: "user", content: userContentString },
      ],
      model: model,
      temperature: 1,
      response_format: { type: "json_object" },
      tools: [{
        type: "function",
        function: {
          "name": "JSON_SOAP_note",
          "description": "Clinical SOAP note as a JSON object",
          "parameters": JSON_schema
        }
      }],
      tool_choice: { "type": "function", "function": { "name": "JSON_SOAP_note" } }
    });

    const completionString = openAIcompletion.choices[0].message.tool_calls?.[0].function.arguments as string
    const usage = openAIcompletion.usage

    if (!usage) return;

    const inputTokens = usage.prompt_tokens;
    const outputTokens = usage.completion_tokens
    const pricing = modelPricing[model]
    const inputCost = pricing['input_token_cost']
    const outputCost = pricing['output_token_cost']

    const openAICost = ((inputTokens / 1000 * inputCost) + (outputTokens / 1000 * outputCost)).toFixed(6)

    await updateNoteWithSOAPData(noteid, transcript, transcriptionTime, completionString, openAICost);
    
  } catch (error){
    console.log("Error getting openAI completion data:", error)
  }
  
}



// Update the appointment table row with the structured data
async function updateNoteWithSOAPData(noteid: string, transcript: string, transcriptionTime:string, completion: string, analysisCost:string){
  console.log("Running updateNoteWithSOAPData");

  const formattedAnalysisCost = parseFloat(analysisCost);
  // Replicate pricing for model running on Nvidia A40 (Large) GPU hardware, which costs $0.000725 per second.
  const transcriptionCost = Number((0.000725 * Number(transcriptionTime)).toFixed(6));
   
  
  const supabase = createClientJS(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  try {
    // Assumes 100% success rate returning object in correct format
    const completionObject = JSON.parse(completion);

    console.log("Attempting to update note using noteid.")
    const { data, error, status } = await supabase
      .from('note')
      .update({
        status: "draft",
        audio_transcript: transcript,
        transcription_time: transcriptionTime,
        transcription_cost: transcriptionCost,
        analysis_cost: formattedAnalysisCost,
        ...completionObject
      })
      .eq('id', noteid)
      .select();
    
    if (error) {
      console.log("Error updating Supabase table:", error)
      // throw new Error(`Error updating note in Supabase: ${error.message}`);
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Update operation did not affect any rows or returned no data.');
      return;
    }

    // console.log('Note updated successfully!', data);
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error(error)
  }
}


// FOR INCLUDING USER APPOINTMENT TYPES AND SPECIALTIES WITH PROMPT:
// const userSettings = await getUserSettingsFromNoteId(noteid)
  // const appointmentTypes = JSON.stringify(userSettings.appointment_types);
  // const appointmentSpecialties = JSON.stringify(userSettings.appointment_specialties);
  // const appointmentTypes = "['In Person', 'Telemedicine']"
  // const appointmentSpecialties = "['Urgent Care', 'Primary Care']"
  // "appointment_type?": {
  //             "type": "string",
  //             "enum": ${appointmentTypes},
  //             "description": "Type of appointment. Only include this key if appointment type is stated in the transcript."
  //           },
  //           "appointment_specialty?": {
  //             "type": "string",
  //             "enum": ${appointmentSpecialties},
  //             "description": "Specialty of the appointment. Only include this key if appointment specialty is stated in the transcript."
  //           },


// export async function analyzeTranscript(noteid: string, transcript: string, transcriptionTime: string, model: string) {
//   console.log("calling analyzeTranscript")

//   const systemContentString:string = `You are a helpful, highly-trained medical assistant. Carefully review the following TRANSCRIPT and generate a clinical SOAP note as a JSON object. The JSON object should conform to the following JSON Schema:

//         {
//           "$schema": "http://json-schema.org/draft-07/schema#",
//           "type": "object",
//           "properties": {
//             "appointment_date": {
//               "type": "string",
//               "format": "date",
//               "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
//               "description": "Date of the appointment in yyyy-mm-dd format"
//             },
//             "appointment_time": {
//               "type": "string",
//               "pattern": "^\\d{2}:\\d{2}$",
//               "description": "Time of the appointment in hh:mm format"
//             },
//             "chief_complaint": {
//               "type": "string",
//               "maxLength": 50,
//               "description": "Chief complaint. Capitalize the first letter of the string"
//             },
//             "soap_subjective": {
//               "type": "string",
//               "description": "Subjective information from the patient. DO NOT include patient name or date of birth."
//             },
//             "soap_objective": {
//               "type": "string",
//               "description": "Objective observations and measurements. Narrative format or UNORDERED list. DO NOT include patient name or date of birth."
//             },
//             "soap_assessment": {
//               "type": "string",
//               "description": "Assessment and diagnosis. Narrative format or UNORDERED list."
//             },
//             "soap_plan": {
//               "type": "string",
//               "description": "Plan for treatment and patient education. Narrative format or UNORDERED list."
//             },
//             "differential_diagnosis": {
//               "type": "string",
//               "description": "Differential diagnosis. Narrative format or UNORDERED list."
//             },
//             "patient_location?": {
//               "type": "string",
//               "description": "Location of the patient (State/Province, e.g., 'Arizona'). Only include this key if the patient location is clearly mentioned in the transcript."
//             }
//           }
//         }

//         Your answer MUST begin and end with curly brackets. Do not include any leading backticks or other markers. ALL LISTS SHOULD BE UNORDERED AND STYLED WITH A SIMPLE DASH. NO NUMBERED LISTS. Include as much specific information as possible from the transcript in the SOAP note. Be thorough! If you do not have the information required to provide a value in any of the fields, just return the JSON object WITHOUT those fields. Do NOT return a field with an empty string or an "unknown" value. For the differential_diagnosis field, analyze the entire transcript and return a differential diagnosis along with possible alternative treatment options. Your complete answer MUST begin and end with curly brackets.`
//   const userContentString:string = `Give me a thorough SOAP note from the following transcript. Return your response as a JSON object. TRANSCRIPT: ${transcript}`
  
//   // console.log("system content string:", systemContentString)

//   try {
//     const apiKey = process.env.ANTHROPIC_API_KEY;
//     if (!apiKey) {
//       throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
//     }

//     const anthropic = new Anthropic({ apiKey });
//     const anthropicResponse = await anthropic.messages.create({
//       model: "claude-3-5-sonnet-20240620",
//       max_tokens: 4096,
//       system: systemContentString,
//       messages: [
//         {
//           "role": "user",
//           "content": userContentString
//         }
//       ]
//     })

//     console.log("anthropic response:", anthropicResponse)

//     assertIsTextBlock(anthropicResponse.content[0]);

//     const anthropicCompletionString = anthropicResponse.content[0].text

//     const anthropicInputTokens = anthropicResponse.usage.input_tokens
//     const anthropicOutputTokens = anthropicResponse.usage.output_tokens
//     const analysisCost:string = ((anthropicInputTokens / 1000 * 0.003) + (anthropicOutputTokens / 1000 * 0.015)).toFixed(3) //claude-3-5-sonnet-20240620

//     console.log("anthropic cost:", analysisCost)

//     await updateNoteWithSOAPData(noteid, transcript, transcriptionTime, anthropicCompletionString, analysisCost);
    
//   } catch (error){
//     console.log("Error getting completion data:", error)
//   }
  
// }
