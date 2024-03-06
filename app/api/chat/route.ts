import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
  const { messages } = await req.json();
  // console.log("req body:", body);


  const prompt = [
    {
      role: "system",
      content: `You are a medical advocate....`
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      ...prompt,
      // filter messages to only send user's messages to AI API
      ...messages.filter((message: Message) => message.role === "user")
    ],
    stream: true
  });
  
  // UPDATE UI TO ACCOMODATE OPENAISTREAM
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
} catch (e) {
  throw e
}

}
