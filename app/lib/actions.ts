'use server'

import Replicate from "replicate";
import OpenAI from "openai"
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createClientJS } from "@supabase/supabase-js";
import { SystemPromptVersion, systemPrompts } from "./systemPrompts";
import { JSONSchemaVersion, JSONschemas } from "./jsonSchemas";
import modelConfig from './modelConfig.json'
import { modelPricing, ModelPricingKeys } from "./modelPricing";


interface SOAPData {
  noteId: string;
  transcript: string;
  transcriptionTime: string;
  completionString: string;
  llmCost: string;
  llmModel: string;
  llmTemperature: number;
  jsonSchemaVersion: number;
  systemPromptVersion: number;
}

function generateUserPrompt(transcript: string) {
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
      webhook: `${webhookUrl}?noteId=${apptid}`,
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


export async function getToolCallingAnalysisOpenAI(noteId: string, transcript: string, transcriptionTime: string) {
  console.log("calling getToolCallingAnalysisOpenAI with transcript:", transcript)

  // const userContentString: string = generateUserContentString(transcript);
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const model = "gpt-4o-mini"

    // Update system content string to specify that the model will need to call a function?
    // if the transcript asks to use a template, then call the getTemplates function (use service key?)
    // get a payload with all the template information.
    // Send the appropriate template content to the function JSON_SOAP_note along with transcript.
    // Error handling: if no template found, complete note with NO TEMPLATE FOUND as soap_subjective?
    // if the transcript does not ask to use a template, then use the JSON_SOAP_note function

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemContentStringToolCalling
        },
        { role: "user", content: `Here is the transcript: ${transcript} // Here is the noteId: ${noteId} // Here is the transcriptionTime: ${transcriptionTime}` },
      ],
      model: model,
      temperature: 1,
      response_format: { type: "json_object" },
      tools: [{
        type: "function",
        function: {
          name: "fetchUserTemplates",
          description: "Fetch user templates. Call this whenever the user asks to use an existing template. The user may want to make additions or adjustments to the template. Call this function to get a list of all of their templates so that you can find the right one and use that to help generate a SOAP note.",
          }
        },
        {
        type: "function",
        function: {
          name: "generateNote",
          description: "Generate SOAP note as a JSON object. Call this when you have sufficient data in the transcript to generate a SOAP note.",
          parameters: { 
            type: "object",
            properties: {
              noteid: {
                type: "string",
              },
              transcript: {
                type: "string",
              },
              transcriptionTime: {
                type: "string",
              },
            },
            required: ["noteid", "transcript", "transcriptionTime"]
          }
        }
      }],
    });


    console.log("completion obj:", completion)

    let toolCall = completion.choices[0].message.tool_calls?.[0].function.name
    let args = completion.choices[0].message.tool_calls?.[0].function.arguments

    console.log(`calling ${toolCall} with the following arguments: ${args}`)

    if (toolCall == "fetchUserTemplates") {
      toolCall
    }
    if (toolCall == "generateNote") {
      
    }

    // console.log("tool calls:", completion.choices[0].message.tool_calls?.[0].function.name)

    // If tool_choice == fetchUserTemplates:
    // call fetchUserTemplates
    
    // If tool_choice == createJSONSoapNote:
    // const completionString = openAIcompletion.choices[0].message.tool_calls?.[0].function.arguments as string
    // const usage = openAIcompletion.usage

    // if (!usage) return;

    // const inputTokens = usage.prompt_tokens;
    // const outputTokens = usage.completion_tokens
    // const pricing = modelPricing[model]
    // const inputCost = pricing['input_token_cost']
    // const outputCost = pricing['output_token_cost']

    // const openAICost = ((inputTokens / 1000 * inputCost) + (outputTokens / 1000 * outputCost)).toFixed(6)

    // await updateNoteWithSOAPData(noteid, transcript, transcriptionTime, completionString, openAICost);
    
  } catch (error){
    console.log("Error getting openAI completion data:", error)
  }
  
}

export async function getAnalysisOpenAI(noteId: string, transcript: string, transcriptionTime: string) {
  
  const { systemPromptVersion, currentModel: llmModel, jsonSchemaVersion, llmTemperature } = modelConfig;

  const systemPrompt = systemPrompts[systemPromptVersion as SystemPromptVersion] 

  const userPrompt: string = generateUserPrompt(transcript);

  const JSONSchema = JSONschemas[jsonSchemaVersion as JSONSchemaVersion]


  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const openAIcompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        { role: "user", content: userPrompt },
      ],
      model: llmModel,
      temperature: llmTemperature,
      response_format: { type: "json_object" },
      tools: [
        {
          type: "function",
          function: {
            "name": "JSON_SOAP_note",
            "description": "Create clinical SOAP note as a JSON object",
            "parameters": JSONSchema
          }
        }],
      tool_choice: { "type": "function", "function": { "name": "JSON_SOAP_note" } }
    });

    const completionString = openAIcompletion.choices[0].message.tool_calls?.[0].function.arguments as string
    const usage = openAIcompletion.usage

    if (!usage) return;

    const inputTokens = usage.prompt_tokens;
    const outputTokens = usage.completion_tokens
    const pricing = modelPricing[llmModel as ModelPricingKeys]
    const inputCost = pricing['input_token_cost']
    const outputCost = pricing['output_token_cost']

    const llmCost = ((inputTokens / 1000 * inputCost) + (outputTokens / 1000 * outputCost)).toFixed(6)


    await updateNoteWithSOAPData({ noteId, transcript, transcriptionTime, completionString, llmCost, jsonSchemaVersion, systemPromptVersion, llmModel, llmTemperature });
    
  } catch (error){
    console.log("Error getting openAI completion data:", error)
  }
  
}



// Update the appointment table row with the structured data
async function updateNoteWithSOAPData(data: SOAPData) {
  const { noteId, transcript, transcriptionTime, completionString, llmCost, systemPromptVersion, jsonSchemaVersion, llmModel, llmTemperature } = data;
  
  console.log("Running updateNoteWithSOAPData");

  const formattedLlmCost = parseFloat(llmCost);

  // Replicate pricing for model running on Nvidia A40 (Large) GPU hardware, which costs $0.000725 per second.
  const transcriptionModel = "vaibhavs10/incredibly-fast-whisper:3ab86df6"
  const transcriptionCost = Number((0.000725 * Number(transcriptionTime)).toFixed(6));

  // llm_prediction_time (text)
  

  const supabase = createClientJS(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  try {
    // Assumes 100% success rate returning object in correct format
    const completionObject = JSON.parse(completionString);

    console.log("Attempting to update note using noteid.")
    const { data, error, status } = await supabase
      .from('note')
      .update({
        status: "draft",
        audio_transcript: transcript,
        transcription_time: transcriptionTime,
        transcription_cost: transcriptionCost,
        transcription_model: transcriptionModel,
        llm_cost: formattedLlmCost,
        llm_model: llmModel,
        llm_temperature: llmTemperature,
        system_prompt_version: systemPromptVersion,
        json_schema_version: jsonSchemaVersion,
        ...completionObject
      })
      .eq('id', noteId)
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




// const modelPricing = {
//     "gpt-4": {
//         "input_token_cost": 0.03,
//         "output_token_cost": 0.06
//     },
//     "gpt-4-turbo": {
//         "input_token_cost": 0.01,
//         "output_token_cost": 0.03
//     },
//     "gpt-4o": {
//         "input_token_cost": 0.005,
//         "output_token_cost": 0.015
//     },
//     "gpt-4o-mini": {
//         "input_token_cost": 0.00015,
//         "output_token_cost": 0.0006
//     },
//     "gpt-3.5-turbo": {
//         "input_token_cost": 0.0005,
//         "output_token_cost": 0.0015
//     },
//     "claude-3-haiku-20240307": {
//         "input_token_cost": 0.00025,
//         "output_token_cost": 0.00125
//     },
//     "claude-3-5-sonnet-20240620": {
//         "input_token_cost": 0.003,
//         "output_token_cost": 0.015
//     },
//     "claude-3-opus-20240229": {
//         "input_token_cost": 0.015,
//         "output_token_cost": 0.075
//     }
// }

// const medications:string[] = [
//     "Aspirin",
//     "Acetaminophen",
//     "Ibuprofen",
//     "Naproxen",
//     "Flexeril",
//     "Hydrocodone",
//     "Oxycodone",
//     "Tramadol",
//     "Lidocaine",
//     "Epinephrine",
//     "Nitroglycerin",
//     "Albuterol",
//     "Prednisone",
//     "Dexamethasone",
//     "Amoxicillin",
//     "Azithromycin",
//     "Cephalexin",
//     "Ciprofloxacin",
//     "Metronidazole",
//     "Clindamycin",
//     "Lorazepam",
//     "Diazepam",
//     "Midazolam",
//     "Fentanyl",
//     "Morphine",
//     "Ondansetron",
//     "Promethazine",
//     "Diphenhydramine",
//     "Hydrocortisone",
//     "Ipratropium",
//     "Atropine",
//     "Naloxone",
//     "Flumazenil",
//     "Metoprolol",
//     "Lisinopril",
//     "Losartan",
//     "Hydrochlorothiazide",
//     "Simvastatin",
//     "Warfarin",
//     "Heparin",
//     "Insulin",
//     "Glucagon",
//     "Nitrofurantoin",
//     "Sulfamethoxazole/Trimethoprim",
//     "Chlorhexidine",
//     "Ranitidine",
//     "Omeprazole",
//     "Pantoprazole"
// ]

// const systemContentString:string = `As a highly skilled medical assistant, your task is to meticulously review the provided TRANSCRIPT and craft a clinical SOAP note in the form of a JSON object. Please adhere strictly to the following guidelines:
// - Ensure all lists within the SOAP note are unordered, formatted with a simple dash (-). Avoid using numbered lists.
// - Incorporate as much detailed information as possible from the transcript into the SOAP note. Thoroughness is key, but do not make up information that is not in the transcript!
// - If certain information required for any fields is missing from the transcript, exclude those fields from the JSON object entirely. Do not include fields with empty strings or "unknown" values.
// - The transcript may not explicitly mention differential diagnoses. As an expert, you are expected to formulate a differential diagnosis based on the transcript information. Always include a differential diagnosis along with alternative treatment recommendations in your SOAP note.
// - Be vigilant for formatting and spelling errors in the transcript, particularly regarding prescription medications. Here is a list of common medication names: ${medications} . The transcript may include misspellings of these or other medications. Be sure to provide the correct spelling. Correct medication dosage transcriptions by standardizing the format to use a slash ("/") between different ingredient amounts. Convert verbal expressions of dosage, such as "five slash three twenty-five milligrams" or "five milligrams and three hundred twenty-five milligrams," to the format "5/325 milligrams." Ensure the correct separation of amounts and units according to standard prescription practices.
// - Include detailed patient instructions. These are instructions that are given to the patient at the end of the appointment. 
// Your expertise and attention to detail will ensure the generation of a comprehensive and accurate SOAP note.`

// const systemContentStringWithTemplates:string = `As a highly skilled medical assistant, your task is to meticulously review the provided TRANSCRIPT and craft a clinical SOAP note in the form of a JSON object. Please adhere strictly to the following guidelines:
// - If the healthcare provider mentions that they want to use an existing template, select the appropriate template from the list of provided templates. Use the text from that template in your SOAP note. Be sure to accomodate any additions or alterations the provider may reqiest. Your final SOAP note should be based on the appropriate template but may have some changes if requested by the healthcare provider.
// - Ensure all lists within the SOAP note are unordered, formatted with a simple dash (-). Avoid using numbered lists.
// - Incorporate as much detailed information as possible from the transcript into the SOAP note. Thoroughness is key, but do not make up information that is not in the transcript!
// - If certain information required for any fields is missing from the transcript, exclude those fields from the JSON object entirely. Do not include fields with empty strings or "unknown" values.
// - The transcript may not explicitly mention differential diagnoses. As an expert, you are expected to formulate a differential diagnosis based on the transcript information. Always include a differential diagnosis along with alternative treatment recommendations in your SOAP note.
// - Be vigilant for formatting and spelling errors in the transcript, particularly regarding prescription medications. Here is a list of common medication names: ${medications} . The transcript may include misspellings of these or other medications. Be sure to provide the correct spelling. Correct medication dosage transcriptions by standardizing the format to use a slash ("/") between different ingredient amounts. Convert verbal expressions of dosage, such as "five slash three twenty-five milligrams" or "five milligrams and three hundred twenty-five milligrams," to the format "5/325 milligrams." Ensure the correct separation of amounts and units according to standard prescription practices.
// - Include detailed patient instructions. These are instructions that are given to the patient at the end of the appointment. 
// Your expertise and attention to detail will ensure the generation of a comprehensive and accurate SOAP note.`


// const systemContentStringToolCalling: string = `You are a highly skilled medical assistant, your task is to help a medical provider craft a clinical SOAP note in the form of a JSON object. 
// Your first step is to look at the following message from the healthcare provider and determine if they are asking you to use a pre-existing template or if they have provided you with the information to write a SOAP note.
// - If they are asking you to use a template, you should use tool calling to call the fetchTemplates function. This will give you the information you need to complete the SOAP note as requested.
// - If they have provided you with the information to develop a SOAP note, you should use tool calling to call the generateSOAPNote function.`



// const JSON_schema = {
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
//               "description": "SOAP note subjective including any of the following: History of the present illness including onset, palliating/provoking factors, quality, region/radiation, severity/associated symptoms, and time course (OPQRST); pertinent medical, surgical, family, and social history; current medications with doses and frequency. DO NOT include patient name or date of birth."
//             },
//             "soap_objective": {
//               "type": "string",
//               "description": "Objective observations and measurements. Narrative format or UNORDERED list. DO NOT include patient name or date of birth."
//             },
//             "soap_assessment": {
//               "type": "string",
//               "description": "Assessment and diagnosis. Narrative format or UNORDERED list. NO DIFFERENTIAL DIAGNOSIS in this field."
//             },
//             "soap_plan": {
//               "type": "string",
//               "description": "Plan for treatment and patient education. Narrative format or UNORDERED list. Be sure to correct spelling and formatting of medications."
//             },
//             "patient_instructions": {
//               "type": "string",
//               "description": "Instructions given to the patient."
//             },
//             "differential_diagnosis": {
//               "type": "string",
//               "description": "Differential diagnosis and alternative treatment plan. Narrative format or UNORDERED list. ALWAYS INCLUDE."
//             },
//             "patient_location": {
//               "type": "string",
//               "description": "Location of the patient (State/Province, e.g., 'Arizona'). Only include this key if the patient location is clearly mentioned in the transcript."
//             }
//           }
//         }
