'use client';

import { useState, useEffect, useRef } from 'react';
import { Microphone, Play, Pause, Stop } from '@phosphor-icons/react';

export default function AudioRecorder() {
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [elapsedDuration, setElapsedDuration] = useState<number>(0);
    const [totalDuration, setTotalDuration] = useState<number>(0);
  const [status, setStatus] = useState<
    'initial' | 'recording' | 'finishedRecording' | 'playing'
  >('initial');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let stream: MediaStream;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);

          mediaRecorderRef.current.addEventListener(
            'dataavailable',
            handleDataAvailable,
          );
          mediaRecorderRef.current.addEventListener('stop', stopRecording);
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.removeEventListener(
          'dataavailable',
          handleDataAvailable,
        );
        mediaRecorderRef.current.removeEventListener('stop', stopRecording);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  function startRecording() {
    if (mediaRecorderRef.current) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setStatus('recording');
    }
  }

  function handleDataAvailable(e: BlobEvent) {
    audioChunksRef.current.push(e.data);
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      const blob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || '',
      });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStatus('finishedRecording');
    }
  }

  function playRecording() {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setStatus('playing');
    }
  }

  function pauseRecording() {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setStatus('finishedRecording');
    }
  }

  function deleteRecording() {
    setAudioUrl('');
    setStatus('initial');
  }

  return (
    <div
      className={`grid h-48 w-full max-w-prose grid-rows-4 justify-items-center rounded-md border bg-gray-50 p-4 focus:ring-2`}
    >
      <div>{status === 'initial' ? '' : status === 'recording' ? `${elapsedDuration}` : status === 'finishedRecording' ? `0:00 / ${totalDuration}`}</div>
      <div className="text-sm text-gray-500">
        {status === 'initial' ? 'tap to record' : ''}
      </div>
      <div>
        {status === 'initial' && (
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-teal-600 p-2 shadow">
            <Microphone
              size={32}
              color="white"
              weight="duotone"
              onClick={startRecording}
            />
          </div>
        )}

        {status === 'recording' && (
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-red-600 p-2 shadow">
            <Stop
              size={30}
              color="white"
              weight="duotone"
              onClick={stopRecording}
            />
          </div>
        )}
        {status === 'finishedRecording' && (
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-teal-600 p-2 shadow">
            <Play
              size={32}
              color="white"
              weight="duotone"
              onClick={playRecording}
            />
          </div>
        )}

        {status === 'playing' && (
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-teal-600 p-2 shadow">
            <Pause
              size={32}
              color="white"
              weight="duotone"
              onClick={pauseRecording}
            />
          </div>
        )}
        <audio ref={audioPlayerRef} src={audioUrl} hidden></audio>
      </div>
      {status === 'finishedRecording' || status === 'playing' ? (
        <div className="grid w-full grid-cols-2 items-center text-center">
          <div
            className="mx-8 cursor-pointer rounded-lg border py-1 text-gray-700"
            onClick={deleteRecording}
          >
            delete
          </div>
          <div className="mx-8 cursor-pointer rounded-lg border py-1 text-gray-700">
            upload
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
