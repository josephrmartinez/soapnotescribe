import { NextResponse } from "next/server";
import { getAnalysisOpenAI } from "@/app/lib/actions";

export async function GET(req) {
    console.log("GETing webhook route");
    // console.log("apptid:", req.nextUrl.searchParams.get('apptid'))
    return NextResponse.json({ message: "GET" }, { status: 200 });
  }

export async function POST(req, res) {
  // console.log("incoming webhook!");

    const noteid = req.nextUrl.searchParams.get('apptid');

    const prediction = await req.json();
    //console.log("replicate prediction:", prediction)
    const transcript = prediction.output.text;
    const transcriptionTime = prediction.metrics.predict_time;
    
    await getAnalysisOpenAI(noteid, transcript, transcriptionTime);
    
    return NextResponse.json({ message: "POST success!" }, { status: 200 });
  }