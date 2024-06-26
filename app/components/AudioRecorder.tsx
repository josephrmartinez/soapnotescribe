'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Microphone, Play, Pause, Stop } from '@phosphor-icons/react';

interface AudioRecorderProps {
  uploadAudioRecording: (blob: Blob) => Promise<void>;
}

export default function AudioRecorder({
  uploadAudioRecording,
}: AudioRecorderProps) {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [elapsedRecordingTime, setElapsedRecordingTime] = useState<string>('');
  const [playbackTimeFormatted, setPlaybackTimeFormatted] = useState('0:00');
  const [totalDuration, setTotalDuration] = useState<string>('0:00');
  const [status, setStatus] = useState<
    | 'initial'
    | 'recording'
    | 'finishedRecording'
    | 'playing'
    | 'uploading'
    | 'uploaded'
  >('initial');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const drawVisualRef = useRef<number | null>(null);

  const initializeMediaRecorder = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.addEventListener(
          'dataavailable',
          handleDataAvailable,
        );
        mediaRecorderRef.current.addEventListener('stop', stopRecording);
      } catch (error) {
        console.error(`The following getUserMedia error occured: ${error}`);
      }
    } else {
      console.log('getUserMedia not supported on this browser.');
    }
  }, []);

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio) {
        setPlaybackTimeFormatted(formatPlaybackTime(audio.currentTime));

        if (
          audioPlayerRef.current?.currentTime ===
          audioPlayerRef.current?.duration
        ) {
          pauseRecording();
        }
      }
    };
    audio.addEventListener('timeupdate', updateTime);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  function startRecording() {
    (async () => {
      if (!mediaRecorderRef.current) {
        await initializeMediaRecorder();
      }

      setElapsedRecordingTime('0:00');

      if (mediaRecorderRef.current) {
        const startTime = Date.now();

        intervalIdRef.current = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          setElapsedRecordingTime(formatTime(elapsedSeconds));
        }, 1000);

        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setStatus('recording');

        await new Promise((resolve) => setTimeout(resolve, 100));
        const canvas = document.getElementById('visualizer');
        if (canvas) {
          visualize();
        } else {
          console.log('Canvas element not found');
        }
      }
    })();
  }

  function visualize() {
    // Create AudioContext for visualizing audio stream
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    if (!streamRef.current) {
      console.error('stream not found');
      return;
    }

    const source = audioCtx.createMediaStreamSource(streamRef.current);
    source.connect(analyser);

    // set up canvas context for visualizer
    const canvas = document.getElementById('visualizer') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) {
      console.error('Unable to get canvas Ctx');
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    const draw = () => {
      console.log('drawing on canvas');
      drawVisualRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 4.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];

        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    };

    draw();
  }

  function handleDataAvailable(e: BlobEvent) {
    audioChunksRef.current.push(e.data);
  }

  function stopRecording() {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      const blob = new Blob(audioChunksRef.current, {
        type: 'audio/wav',
      });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setTotalDuration(elapsedRecordingTime);
      setStatus('finishedRecording');
    }
    // STOP VISUALIZATION.
    if (drawVisualRef.current) {
      cancelAnimationFrame(drawVisualRef.current);
      drawVisualRef.current = null;
    }

    // Release microphone.
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
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
    setAudioBlob(null);

    // clean up mediaRecorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.removeEventListener(
        'dataavailable',
        handleDataAvailable,
      );
      mediaRecorderRef.current.removeEventListener('stop', stopRecording);
      mediaRecorderRef.current = null;
    }
    setStatus('initial');
  }

  async function handleUpload() {
    if (audioBlob) {
      setStatus('uploading');
      try {
        await uploadAudioRecording(audioBlob);
        setStatus('uploaded');
      } catch (error) {
        console.error('Upload failed:', error);
        setStatus('finishedRecording');
      }
    } else {
      console.error('No audio blob available to upload');
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(1, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const formatPlaybackTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsFormatted = Math.floor(seconds % 60);
    const padZero = (num: number) => (num < 10 ? '0' + num : num);
    return `${String(minutes).padStart(1, '0')}:${padZero(secondsFormatted)}`;
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = newTime;
      setPlaybackTimeFormatted(formatPlaybackTime(newTime));
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.removeEventListener(
          'dataavailable',
          handleDataAvailable,
        );
        mediaRecorderRef.current.removeEventListener('stop', stopRecording);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      <div
        className={`grid h-48 w-full max-w-prose grid-rows-4 justify-items-center rounded-md border bg-gray-50 p-4 focus:ring-2`}
      >
        <div>
          {status === 'initial'
            ? ''
            : status === 'recording'
              ? `${elapsedRecordingTime}`
              : status === 'finishedRecording' || status === 'playing'
                ? `${playbackTimeFormatted} / ${elapsedRecordingTime}`
                : status === 'uploading'
                  ? `uploading...`
                  : status === 'uploaded'
                    ? `upload complete.`
                    : ''}
        </div>
        <div className="w-3/4 text-center text-sm  text-gray-500">
          {status === 'initial' ? (
            'tap to record'
          ) : status === 'recording' ? (
            <canvas
              id="visualizer"
              width={640}
              height={32}
              className="visualizer h-8 w-full"
            ></canvas>
          ) : status === 'finishedRecording' || status === 'playing' ? (
            <input
              type="range"
              min="0"
              max={audioPlayerRef.current?.duration}
              value={audioPlayerRef.current?.currentTime}
              onChange={handleRangeChange}
              className="mx-2 w-full cursor-pointer accent-gray-600"
            />
          ) : (
            ''
          )}
        </div>
        <div>
          {status === 'initial' && (
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-teal-600 p-2 shadow transition-all hover:bg-teal-500 active:bg-teal-600">
              <Microphone
                size={32}
                color="white"
                weight="duotone"
                onClick={startRecording}
              />
            </div>
          )}

          {status === 'recording' && (
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-600  p-2 shadow transition-all hover:bg-red-500 active:bg-red-600">
              <Stop
                size={30}
                color="white"
                weight="duotone"
                onClick={stopRecording}
              />
            </div>
          )}
          {status === 'finishedRecording' && (
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-teal-600 p-2 shadow transition-all hover:bg-teal-500">
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
        </div>
        {status === 'finishedRecording' || status === 'playing' ? (
          <div className="grid w-full grid-cols-2 items-center  justify-items-center text-center">
            <div
              className="w-24 cursor-pointer rounded-lg border py-1 text-gray-700 transition-colors hover:bg-red-500 hover:text-white"
              onClick={deleteRecording}
            >
              delete
            </div>
            <div
              className="w-24 cursor-pointer rounded-lg border py-1 text-gray-700 transition-colors hover:bg-teal-500 hover:text-white"
              onClick={handleUpload} // FUNCTION TO PASS AUDIO FILE TO PARENT COMPONENT
            >
              upload
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <audio ref={audioPlayerRef} src={audioUrl} hidden controls></audio>
    </>
  );
}
