"use client";
import { AudioRecorder } from 'react-audio-voice-recorder';

export default function Recorder() {
  
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };
  return (
<AudioRecorder 
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }} 
      downloadOnSavePress={true}
      showVisualizer={true}
      downloadFileExtension="webm"
    />
  )
}



// import { useState, useRef } from "react";

// const mimeType = "audio/webm";

// const AudioRecorder = () => {
//     const [permission, setPermission] = useState(false);
//   const mediaRecorder = useRef(null);
//   const [recordingStatus, setRecordingStatus] = useState("inactive");
//   const [stream, setStream] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [audio, setAudio] = useState(null);

//     const getMicrophonePermission = async () => {
//         if ("MediaRecorder" in window) {
//             try {
//                 const streamData = await navigator.mediaDevices.getUserMedia({
//                     audio: true,
//                     video: false,
//                 });
//                 setPermission(true);
//                 setStream(streamData);
//             } catch (err) {
//                 alert(err.message);
//             }
//         } else {
//             alert("The MediaRecorder API is not supported in your browser.");
//         }
//     };
//     return (
//         <div>
//             <h2>Audio Recorder</h2>
//             <main>
//                 <div className="audio-controls">
//                     {!permission ? (
//                         <button className="border" onClick={getMicrophonePermission} type="button">
//                             Get Microphone
//                         </button>
//                     ): null}
//                     {permission ? (
//                         <button type="button">
//                             Record
//                         </button>
//                     ): null}
//                 </div>
//             </main>
//         </div>
//     );
// };
// export default AudioRecorder;

// import { useState, useEffect } from "react";

// export default function AudioRecorder() {
//   // Define state variables for the result, recording status, and media recorder
//   const [result, setResult] = useState();
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   // This array will hold the audio data
//   let chunks = [];
//   // This useEffect hook sets up the media recorder when the component mounts
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(stream => {
//           const newMediaRecorder = new MediaRecorder(stream);
//           newMediaRecorder.onstart = () => {
//             chunks = [];
//           };
//           newMediaRecorder.ondataavailable = e => {
//             chunks.push(e.data);
//           };
//           newMediaRecorder.onstop = async () => {
//             const audioBlob = new Blob(chunks, { type: 'audio/webm' });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             const audio = new Audio(audioUrl);
//             // audio.onerror = function (err) {
//             //   console.error('Error playing audio:', err);
//             // };
//             // audio.play();
//             try {
//               const reader = new FileReader();
//               reader.readAsDataURL(audioBlob);
//               reader.onloadend = async function () {
//                 const base64Audio = reader.result.split(',')[1]; // Remove the data URL prefix
//                 const response = await fetch("/api/transcribe", {
//                   method: "POST",
//                   headers: {
//                     'Content-Type': 'application/json'
//                   },
//                   body: JSON.stringify({ audio: base64Audio }),
//                 });
//                 const data = await response.json();
//                 if (response.status !== 200) {
//                   throw data.error || new Error(`Request failed with status ${response.status}`);
//                 }
//                 setResult(data.result);
//               }
//             } catch (error) {
//               console.error(error);
//               alert(error.message);
//             }
//           };
//           setMediaRecorder(newMediaRecorder);
//         })
//         .catch(err => console.error('Error accessing microphone:', err));
//     }
//   }, []);
//   // Function to start recording
//   const startRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.start();
//       setRecording(true);
//     }
//   };
//   // Function to stop recording
//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setRecording(false);
//     }
//   };
//   // Render the component
//   return (
    
//       <div>
//         <h2>
//           Convert audio to text <span>-&gt;</span>
//         </h2>
//         <button onClick={recording ? stopRecording : startRecording} >
//           {recording ? 'Stop Recording' : 'Start Recording'}
//       </button>
      
//         <p>{result}</p>
//       </div>
  
//   )
// }