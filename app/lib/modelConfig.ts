
// interface ProviderConfig {
//     apiKeyEnvName: string,

// }

// interface ModelConfig {
//     systemContentString?: string;
//     userContentString?: string;
//     providerConfig: ProviderConfig;
//     name: string;
//     provider: string;
//     inputTokensCost: number;
//     outputTokensCost: number;
//     makeRequest(): void;
// }


// // Actual configs
// const AnthropicConfig: ProviderConfig = {
//     apiKeyEnvName: 'ANTHROPIC_API_KEY'
// }

// const SonnetConfig: ModelConfig = {
//     providerConfig: AnthropicConfig,
//     name: 'claude-3-5-sonnet-20240620',
//     provider: 'Anthropic',


// }


// export async function getAnalysis(model: ModelConfig, noteid: string, transcript: string, transcriptionTime: string) {

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
  

//   try {
//     const apiKey = process.env[model.providerConfig.apiKeyEnvName];
//     if (!apiKey) {
//       throw new Error('API key is not set in environment variables.');
//     }

//       if (model.provider == "Anthropic") {
        
//           const anthropic = new Anthropic({ apiKey });
//             const anthropicResponse = await anthropic.messages.create({
//             model: "claude-3-5-sonnet-20240620",
//             max_tokens: 4096,
//             system: systemContentString,
//             messages: [
//                 {
//                 "role": "user",
//                 "content": userContentString
//                 }
//             ]
//             })
//       }
    

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


// export async function getAnalysisOpenAI(noteid: string, transcript: string, transcriptionTime: string) {
//   console.log("calling getSOAPData")

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
//     const openai = new OpenAI({ apiKey })

//   const openAIcompletion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: systemContentString
//       },
//       { role: "user", content: userContentString },
//     ],
//     model: "gpt-4o-mini",
//     response_format: { type: "json_object" },
//   });

//     const completionString = openAIcompletion.choices[0].message.content as string
//     const usage = openAIcompletion.usage
//     const inputTokens = usage?.prompt_tokens;
//     const outputTokens = usage?.completion_tokens

//     // gpt-4-turbo pricing
//     // const openAICost = ((inputTokens / 1000 * 0.01) + (outputTokens / 1000 * 0.03)).toFixed(3)

//     // gpt-4o pricing
//     // const openAICost = ((inputTokens / 1000 * 0.005) + (outputTokens / 1000 * 0.015)).toFixed(4)


//     // gpt-4o-mini pricing
//     const openAICost = ((inputTokens / 1000 * 0.00015) + (outputTokens / 1000 * 0.0006)).toFixed(6)


//     console.log("openAI completion sttring:", completionString)
//     console.log("openAI cost:", openAICost)

//     await updateNoteWithSOAPData(noteid, transcript, transcriptionTime, completionString, openAICost);
    
//   } catch (error){
//     console.log("Error getting openAI completion data:", error)
//   }
  
// }

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