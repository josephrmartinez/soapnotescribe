import { NextResponse } from "next/server";
import { getAnalysisOpenAI } from "@/app/lib/actions";
import { getToolCallingAnalysisOpenAI } from "@/app/lib/actions";

export async function GET(req) {
    console.log("GETing webhook route");
    return NextResponse.json({ message: "GET" }, { status: 200 });
  }

export async function POST(req, res) {
  // console.log("incoming webhook!");

    const noteId = req.nextUrl.searchParams.get('noteId');

    const prediction = await req.json();
    //console.log("replicate prediction:", prediction)
    const transcript = prediction.output.text;
    const transcriptionTime = prediction.metrics.predict_time;
    
    // await getAnalysisOpenAI(noteid, transcript, transcriptionTime);
    await getToolCallingAnalysisOpenAI(noteId, transcript, transcriptionTime);  
  
    return NextResponse.json({ message: "POST success!" }, { status: 200 });
  }