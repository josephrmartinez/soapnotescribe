import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Parse the incoming request body as FormData
      const formData = req.body;

      // Get the base64-encoded audio data from the FormData
      const audioFile = formData.audio

    

      // Call the OpenAI API for transcription
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'text',
      });

      // Send back the transcription
      res.status(200).json({ transcription: transcription.text });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to transcribe audio' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
// // Import necessary libraries
// import { Configuration, OpenAIApi } from "openai";
// import { exec } from 'child_process';
// import fs from 'fs';
// import { NextResponse } from "next/server";

// // Promisify the exec function from child_process
// const util = require('util');
// const execAsync = util.promisify(exec);
// // Configure the OpenAI API client
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// // This function handles POST requests to the /api/speechToText route
// export async function POST(request) {
//   // Check if the OpenAI API key is configured
//   if (!configuration.apiKey) {
//     return NextResponse.json({ error: "OpenAI API key not configured, please follow instructions in README.md" }, {status:500});
//   }
//   // Parse the request body
//   const req = await request.json()
//   // Extract the audio data from the request body
//   const base64Audio = req.audio;
//   // Convert the Base64 audio data back to a Buffer
//   const audio = Buffer.from(base64Audio, 'base64');
//   try {
//     // Convert the audio data to text
//     const text = await convertAudioToText(audio);
//     // Return the transcribed text in the response
//     return NextResponse.json({result: text}, {status:200});
//   } catch(error) {
//     // Handle any errors that occur during the request
//     if (error.response) {
//       console.error(error.response.status, error.response.data);
//       return NextResponse.json({ error: error.response.data }, {status:500});
//     } else {
//       console.error(`Error with OpenAI API request: ${error.message}`);
//       return NextResponse.json({ error: "An error occurred during your request." }, {status:500});
//     }
//   }
// }
// // This function converts audio data to text using the OpenAI API
// async function convertAudioToText(audioData) {
//   // Convert the audio data to MP3 format
//   const mp3AudioData = await convertAudioToMp3(audioData);
//   // Write the MP3 audio data to a file
//   const outputPath = '/tmp/output.mp3';
//   fs.writeFileSync(outputPath, mp3AudioData);
//   // Transcribe the audio
//   const response = await openai.createTranscription(
//       fs.createReadStream(outputPath),
//       'whisper-1'
//   );
//   // Delete the temporary file
//   fs.unlinkSync(outputPath);
//   // The API response contains the transcribed text
//   const transcribedText = response.data.text;
//   return transcribedText;
// }
// // This function converts audio data to MP3 format using ffmpeg
// async function convertAudioToMp3(audioData) {
//   // Write the audio data to a file
//   const inputPath = '/tmp/input.webm';
//   fs.writeFileSync(inputPath, audioData);
//   // Convert the audio to MP3 using ffmpeg
//   const outputPath = '/tmp/output.mp3';
//   await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);
//   // Read the converted audio data
//   const mp3AudioData = fs.readFileSync(outputPath);
//   // Delete the temporary files
//   fs.unlinkSync(inputPath);
//   fs.unlinkSync(outputPath);
//   return mp3AudioData;
// }

// import { NextApiRequest, NextApiResponse } from 'next';
// import OpenAI from 'openai';

// const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY })


// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     const audioFile = req.body.audio; // File data from FormData
  
//     if (!audioFile) {
//       return res.status(400).json({ error: 'No audio file uploaded' });
//     }
  
//     try {
//       // Convert base64 audio data to a Blob
//       const blob = Buffer.from(audioFile, 'base64');
//       const file = new File([blob], 'audio.mp3', { type: 'audio/mp3' });
  
//       const transcription = await openai.audio.transcriptions.create({
//         file: file,
//         model: 'whisper-1',
//         response_format: 'text',
//       });
  
//       res.status(200).json({ transcription: transcription.text });
//     } catch (error) {
//       console.error('Error transcribing audio:', error);
//       res.status(500).json({ error: 'Error transcribing audio' });
//     }
//   }