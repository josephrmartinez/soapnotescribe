import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';
import { getContext } from "@/app/lib/data";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
  const { messages } = await req.json();
  // console.log("req body:", body);

  // Get the last message
  const lastMessage = messages[messages.length - 1];

  // Get the context from the last message
  const context = await getContext(lastMessage.content);
  console.log("context var in API route:", context)

  const prompt = [
    {
      role: "system",
      content: `You are a medical advocate. A user is going to ask a question that may be answered with information from their previous appointments. Information from recent appointments relevant to the user's question will appear in the appointmentcontext below:
      
      START OF APPOINTMENT CONTEXT
      ${context}
      END OF APPOINTMENT CONTEXT
      
      If the context does not provide the answer to the question, you must state this in your response. Do not invent anything that is not covered in the context. If the context does help you provide a response, you must refer to the specific appointment. Reference the date of the appointment, the name of the provider, and the name of the clinic in your response.`
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
