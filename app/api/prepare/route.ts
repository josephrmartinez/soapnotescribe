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
  console.log("req body:", body);
  const { type, situation, concerns, history }: RequestBody = body;

  const content = (type ? `Appointment type: ${type} /// ` : " /// ") 
                + (situation ? `Current health concern or symptoms (this is what prompted me to schedule the appointment): ${situation} /// ` : " /// ")
                + (concerns ? `Expectations and concerns (specific concerns or questions I want to address with the doctor): ${concerns} /// ` : " /// ")
                + (history ? `Treatment / Medication History (information on current medications and whether I have tried any treatments or interventions for the current health concern): ${history} /// ` : " /// ");

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [{"role": "system", "content": "You are a helpful medical advocate. A patient is going to share information about an upcoming medical appointment. Please generate a list of five questions that they can ask their doctor to make the most out of their medical appointment. Just return the five questions, nothing else, no intro sentence."}, 
    {"role": "user", "content": `${content}`}],
  });
  
  const response = completion.choices[0].message;
  console.log("openai completion", completion)

  return NextResponse.json({ output: response }, { status: 200 });
}
