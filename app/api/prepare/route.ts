import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';


export const runtime = 'edge'


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


interface RequestBody {
    type?: string | null;
    situation?: string | null;
    concerns?: string | null;
    history?: string | null;
  }

export async function POST(req: Request, res: NextResponse) {
  const body:RequestBody = await req.json();
  // console.log("req body:", body);
  const { type, situation, concerns, history }: RequestBody = body;

  const content = (type ? `Appointment type: ${type} /// ` : " /// ") 
                + (situation ? `Current health concern or symptoms (this is what prompted me to schedule the appointment): ${situation} /// ` : " /// ")
                + (concerns ? `Expectations and concerns (specific concerns or questions I want to address with the doctor): ${concerns} /// ` : " /// ")
                + (history ? `Treatment / Medication History (information on current medications and whether I have tried any treatments or interventions for the current health concern): ${history} /// ` : " /// ");

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [{"role": "system", "content": "You are a supportive medical advocate aiding a patient in preparing for an upcoming medical appointment. The patient will share details about the appointment and their health concerns. Please use this information to respond with a JSON object containing two lists: 'questions' and 'searches'. For the 'questions' list, generate a list of five questions the patient can ask their doctor to maximize the effectiveness of their upcoming appointment. For the 'searches' list, generate an unnumbered list of five very specific search engine queries that the patient could make to access high-quality resources to help them prepare for the medical appointment. Simply return the JSON object containing the 'questions' and 'searches' lists."}, 
    
    {"role": "user", "content": `${content}`}],
    response_format: {type: "json_object"}
  });
  
  const response = completion.choices[0].message.content;
  // console.log("response", response)

  return NextResponse.json({ output: response }, { status: 200 });
}