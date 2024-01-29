import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request, res: NextResponse) {
  const body = await req.json();
  console.log("req body:", body);

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: body.messages,
  });
  
  const response = completion.choices[0].message;
  console.log("openai completion", completion)

  return NextResponse.json({ output: response }, { status: 200 });
}
