import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request, res: NextResponse) {
  const body = await req.json();
  // console.log("req body:", body);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: body.messages,
    stream: true
  });
  
  // UPDATE UI TO ACCOMODATE OPENAISTREAM
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)

  // return NextResponse.json({ output: response }, { status: 200 });
}
