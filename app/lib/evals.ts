'use server'

import OpenAI from "openai"
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createClientJS } from "@supabase/supabase-js";
import modelPricingJson from './modelPricing.json';


interface ModelPricing {
  [key: string]: {
    inputTokenCost: number;
    outputTokenCost: number;
  };
}

interface LogResponseDataParams {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  predictionCost: string;
  predictionTime: number;
    completionString: string;
    model: string;
    temperature: number;
}

const modelPricing = modelPricingJson as ModelPricing


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
            "chief_complaint": {
              "type": "string",
              "maxLength": 50,
              "description": "Chief complaint. Capitalize the first letter of the string"
            },
            "soap_subjective": {
              "type": "string",
              "description": "Subjective information from the patient. DO NOT include patient name or date of birth."
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
              "description": "Plan for treatment and patient education. Narrative format or UNORDERED list."
            },
            "differential_diagnosis": {
              "type": "string",
              "description": "Differential diagnosis. Narrative format or UNORDERED list."
            },
            "patient_location?": {
              "type": "string",
              "description": "Location of the patient (State/Province, e.g., 'Arizona'). Only include this key if the patient location is clearly mentioned in the transcript."
            }
          }
        }

        Your answer MUST begin and end with curly brackets. Do not include any leading backticks or other markers. ALL LISTS SHOULD BE UNORDERED AND STYLED WITH A SIMPLE DASH. NO NUMBERED LISTS. Include as much specific information as possible from the transcript in the SOAP note. Be thorough! If you do not have the information required to provide a value in any of the fields, just return the JSON object WITHOUT those fields. Do NOT return a field with an empty string or an "unknown" value. For the differential_diagnosis field, generate a differential diagnosis along with possible alternative treatment options. Your complete answer MUST begin and end with curly brackets.`

function generateUserContentString(transcript: string) {
    return `Generate a thorough SOAP note from the following transcript. Return your response as a JSON object in the specified schema. TRANSCRIPT: ${transcript}`
  }

function assertIsTextBlock(value: unknown): asserts value is Anthropic.TextBlock {
  if (typeof value === "object" && value && !value.hasOwnProperty("text")) throw new Error('Expected text block');
}


// "claude-3-5-sonnet-20240620"
export async function getAnalysisAnthropic(transcript: string, model: string) {
    console.log("calling getAnalysisAnthropic")
    
    const userContentString: string = generateUserContentString(transcript);
    
  try {
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
    }

    const anthropic = new Anthropic({ apiKey });
    
    const anthropicResponse = await anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      system: systemContentString,
      messages: [
        {
          "role": "user",
          "content": userContentString
        }
      ]
    })

    console.log("anthropic response:", anthropicResponse)

    // assertIsTextBlock(anthropicResponse.content[0]);

    const anthropicCompletionString = anthropicResponse.content[0].text

    const anthropicInputTokens = anthropicResponse.usage.input_tokens
    const anthropicOutputTokens = anthropicResponse.usage.output_tokens
      
    const analysisCost:string = ((anthropicInputTokens / 1000 * 0.003) + (anthropicOutputTokens / 1000 * 0.015)).toFixed(3) //claude-3-5-sonnet-20240620

    console.log("anthropic cost:", analysisCost)

    await updateNoteWithSOAPData(transcript, anthropicCompletionString, analysisCost);
    
  } catch (error){
    console.log("Error getting completion data:", error)
  }
  
}


async function logResponseData(params: LogResponseDataParams) {
  // Implementation remains the same, using params.inputTokens, params.outputTokens, etc.
}


export async function getAnalysisOpenAI(transcript: string, model: string, temperature: number = 1,) {
    console.log("calling getAnalysisOpenAI")
    const startTime = Date.now();

  const userContentString: string = generateUserContentString(transcript);
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
        messages: [
        {
            role: "system",
            content: systemContentString
        },
        { role: "user", content: userContentString },
        ],
        model: model,
        temperature: temperature,
        response_format: { type: "json_object" },
    });

    const completionString = completion.choices[0].message.content as string
    const usage = completion.usage
      
    if (!usage) return;
      
    const inputTokens = usage.prompt_tokens;
    const outputTokens = usage.completion_tokens
    const pricing = modelPricing[model];
    const inputCost = pricing.inputTokenCost;
    const outputCost = pricing.outputTokenCost;
      
    const predictionCost = ((inputTokens / 1000 * inputCost) + (outputTokens / 1000 * outputCost)).toFixed(3)

      const predictionTime = Date.now() - startTime;
      
    const responseData: LogResponseDataParams = {
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        predictionCost,
        predictionTime,
        completionString,
        model,
        temperature
    };

      await logResponseData(responseData);
      
  } catch (error){
    console.log("Error getting openAI completion data:", error)
  }
  
}

export async function analyzeTranscript(noteid: string, transcript: string, transcriptionTime: string, model: string) {
  console.log("calling analyzeTranscript")

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
            "chief_complaint": {
              "type": "string",
              "maxLength": 50,
              "description": "Chief complaint. Capitalize the first letter of the string"
            },
            "soap_subjective": {
              "type": "string",
              "description": "Subjective information from the patient. DO NOT include patient name or date of birth."
            },
            "soap_objective": {
              "type": "string",
              "description": "Objective observations and measurements. Narrative format or UNORDERED list. DO NOT include patient name or date of birth."
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
            "patient_location?": {
              "type": "string",
              "description": "Location of the patient (State/Province, e.g., 'Arizona'). Only include this key if the patient location is clearly mentioned in the transcript."
            }
          }
        }

        Your answer MUST begin and end with curly brackets. Do not include any leading backticks or other markers. ALL LISTS SHOULD BE UNORDERED AND STYLED WITH A SIMPLE DASH. NO NUMBERED LISTS. Include as much specific information as possible from the transcript in the SOAP note. Be thorough! If you do not have the information required to provide a value in any of the fields, just return the JSON object WITHOUT those fields. Do NOT return a field with an empty string or an "unknown" value. For the differential_diagnosis field, analyze the entire transcript and return a differential diagnosis along with possible alternative treatment options. Your complete answer MUST begin and end with curly brackets.`
  const userContentString:string = `Give me a thorough SOAP note from the following transcript. Return your response as a JSON object. TRANSCRIPT: ${transcript}`
  
  // console.log("system content string:", systemContentString)

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
    }

    const anthropic = new Anthropic({ apiKey });
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

    console.log("anthropic response:", anthropicResponse)

    assertIsTextBlock(anthropicResponse.content[0]);

    const anthropicCompletionString = anthropicResponse.content[0].text

    const anthropicInputTokens = anthropicResponse.usage.input_tokens
    const anthropicOutputTokens = anthropicResponse.usage.output_tokens
    const analysisCost:string = ((anthropicInputTokens / 1000 * 0.003) + (anthropicOutputTokens / 1000 * 0.015)).toFixed(3) //claude-3-5-sonnet-20240620

    console.log("anthropic cost:", analysisCost)

    await updateNoteWithSOAPData(noteid, transcript, transcriptionTime, anthropicCompletionString, analysisCost);
    
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
   
  
  const supabase = createClientJS(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  try {
    // Assumes 100% success rate returning object in correct format
    const completionObject = JSON.parse(completion);

    console.log("Attempting to update note using noteid.")
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
      .select();
    
    if (error) {
      console.log("Error updating Supabase table:", error)
      // throw new Error(`Error updating note in Supabase: ${error.message}`);
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Update operation did not affect any rows or returned no data.');
      return;
    }

    console.log('Note updated successfully!', data);
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error(error)
  }
}


