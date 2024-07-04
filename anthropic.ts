const dotenv = require('dotenv');
dotenv.config();

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY })


const transcript = "Okay, today's date is March 23rd, 2024, time scene 1849, patient name Margaret Gilmore, date of birth November 27th, 1968, chief complaint vomiting and diarrhea. Margaret is a however-year-old female who calls today complaining of having vomiting and diarrhea period. She states that she has had these symptoms for approximately one to two days and is concerned that she is dehydrated. She states that she's been going to have, she's been having to go to the bathroom frequently and is concerned about traveling secondary to the frequent diarrhea period she denies any fever chill she denies any body aches and denies any recent travel or recent antibiotic use. Although she has traveled here to Phoenix, she's requesting blood work and IV with IV fluids. She's otherwise healthy. She has no known drug allergies and she denies having any blood in her vomit or stool she just feels that her stomach is empty now and she is getting a leg cramps at night based on her O and her age, I have recommended that she go to Phoenix ER and Medical Center. I have written a script for a CBC with differential, a CMP with lipase. She does report some epigastric and right upper quadrant abdominal pain. Therefore, I will also order a CT scan of the abdomen and pelvis with IV contrast and an ultrasound of her gallbladder for dyspepsia. gallbladder for dyspepsia so diagnosis vomiting and diarrhea diagnosis number two epigastric and right upper quadrant abdominal pain diagnosis number three dyspepsia diagnosis number number four, dehydration. And the patient was sent to Phoenix ER Medical Hospital for the prescribed test. And apparently she did check in as an ER patient. Therefore, her workup was sent to me she was given an IV with IV fluids and Sophran her CBC was within normal limits her CMP shows elevated alkaline phosphatase at 130. Her urinalysis catflax for UTI and zofran for her knowledge please refer to the attached imaging imaging results for the CT scan and ultrasound which were all normal except she was found to have a mass on her uterus which is more likely consistent with a fibroid per the radiologist. However, I've recommended that she see an OBGYN for this and have her alkaline phosphatase repeated in one week to make sure that it diminishes. I also referred her to Dr. Wells, a GI doctor, for further evaluation and management of her abdominal pain and dyspepsia. Thank you."

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
            "appointment_type": {
              "type": "string",
              "enum": ["Telemedicine", "In Person"],
              "description": "Type of appointment: 'Telemedicine' or 'In Person'"
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

        Your answer MUST begin and end with curly brackets. Do not include any leading backticks or other markers. ALL LISTS SHOULD BE UNORDERED. NO NUMBERED LISTS. Include as much specific information as possible from the transcript in the SOAP note. Be thorough! If you do not have the information required to provide a value in any of the fields, just return the JSON object WITHOUT those fields. For the differential_diagnosis field, analyze the entire transcript and return a differential diagnosis along with possible alternative treatment options. Your complete answer MUST begin and end with curly brackets.`

const userContentString:string = `Give me a thorough SOAP note from the following transcript. Return your response as a JSON object. TRANSCRIPT: ${transcript}`

// function assertIsTextBlock(value: unknown): asserts value is Anthropic.TextBlock {
//   if (typeof value === "object" && value && !value.hasOwnProperty("text")) throw new Error('Expected text block');
// }

async function getAnthropicReponse() {
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

    // assertIsTextBlock(anthropicResponse.content[0]);

    console.log("anthropic response:", anthropicResponse.content[0].text)

    const anthropicInputTokens = anthropicResponse.usage.input_tokens
    const anthropicOutputTokens = anthropicResponse.usage.output_tokens
    const anthropicCost = ((anthropicInputTokens / 1000 * 0.003) + (anthropicOutputTokens / 1000 * 0.015)).toFixed(3) //claude-3-5-sonnet-20240620

    console.log("anthropic cost:", anthropicCost)


    const anthropicCompletionObject = JSON.parse(anthropicResponse.content[0].text);

    console.log(anthropicCompletionObject)
}

getAnthropicReponse()