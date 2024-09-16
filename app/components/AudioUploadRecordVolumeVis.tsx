'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Microphone, Play, Pause, Stop } from '@phosphor-icons/react';
import * as tus from 'tus-js-client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { getReplicateMonoTranscript } from '@/app/lib/actions';
import { revalidatePath } from 'next/cache';
import clsx from 'clsx';
import { AMRPlayer, Player } from 'web-amr';
import { fetchPatientProfileById, fetchUserSettings } from '../lib/data';

interface AudioUploadRecordProps {
  patientId: string;
}

const AudioUploadRecordVolumeVis: React.FC<AudioUploadRecordProps> = ({
  patientId,
}) => {
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();
  const accessTokenRef = useRef<string | undefined>('');
  const userIDRef = useRef<string | undefined>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAMR, setIsAMR] = useState<boolean>(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [elapsedRecordingTime, setElapsedRecordingTime] = useState<string>('');
  const [playbackTimeFormatted, setPlaybackTimeFormatted] = useState('0:00');
  const [totalDuration, setTotalDuration] = useState<string>('0:00');
  const [decibelArray, setDecibelArray] = useState<number[]>([]); // State to store decibel levels

  const [status, setStatus] = useState<
    | 'initial'
    | 'recording'
    | 'audioAvailable'
    | 'playing'
    | 'uploading'
    | 'uploaded'
  >('initial');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const drawVisualRef = useRef<number | null>(null);

  // file upload functions
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      } else {
        userIDRef.current = data.session?.user.id;
        accessTokenRef.current = data.session?.access_token;
      }
    };

    fetchUser();
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (status !== 'initial') return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (status !== 'initial') return;
    setIsDragging(false);
  };

  const triggerFileInputClick = () => {
    if (status !== 'initial') return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAudioFileInput(e.target.files[0]);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (status !== 'initial') return;
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (!files[0].type.startsWith('audio/')) return;
      handleAudioFileInput(files[0]);
    }
  };

  useEffect(() => {
    if (audioFile?.type !== 'audio/amr') return;

    let playerInstance: Player | null = null;

    const updateTimeHandler = () => {
      if (playerInstance !== null) {
        setPlaybackTimeFormatted(formatTime(playerInstance.currentTime));
      }
    };

    const checkAndLoadAudio = async () => {
      setIsAMR(true);
      const res = await fetch(audioUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        playerInstance = AMRPlayer(buffer);
        setPlayer(playerInstance);

        setElapsedRecordingTime(formatTime(playerInstance.duration));

        playerInstance.addEventListener('timeupdate', updateTimeHandler);
      }
    };

    if (audioUrl) {
      checkAndLoadAudio();
    }

    return () => {
      if (playerInstance) {
        playerInstance.pause();
        playerInstance.removeEventListener('timeupdate', updateTimeHandler);
      }
    };
  }, [audioFile]);

  async function handleAudioFileInput(file: File) {
    // Create and set a url for audio player
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    setAudioFile(file);

    // Pass along metadata to audioPlayer(Ref)
    if (file.type !== 'audio/amr' && audioPlayerRef.current) {
      audioPlayerRef.current.addEventListener('loadedmetadata', () => {
        // Duration is now available
        // Pass along metadata to audioPlayer(Ref)
        // For example, setting total duration somewhere in your state or props
        setElapsedRecordingTime(
          formatTime(audioPlayerRef.current?.duration || 0),
        );
      });
    }

    // Update status to audioAvailable
    setStatus('audioAvailable');
  }

  async function getDownloadUrl(fileName: string) {
    const { data, error } = await supabase.storage
      .from('audiofiles')
      .createSignedUrl(`${userIDRef.current}/${fileName}`, 1200);
    return data?.signedUrl;
  }

  async function handleUploadClick() {
    setStatus('uploading');

    try {
      if (audioBlob) {
        await handleAudioBlob(audioBlob);
      } else if (audioFile) {
        await handleAudioFile(audioFile);
      } else {
        throw new Error('No audio blob or file available to upload');
      }
      setStatus('uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('audioAvailable');
    }
  }

  // Convert in-browser recording from Blob to File. Add prefix. Pass file to uploadFile.
  const handleAudioBlob = async (blob: Blob) => {
    if (!blob) return;
    try {
      const mimeType = blob.type;
      const extension = mimeType.split('/')[1];
      const fileName = `recording-${self.crypto.randomUUID()}.${extension}`;
      const file = new File([blob], fileName, { type: mimeType });
      await uploadFile('audiofiles', fileName, file);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Add prefix to uploaded audio file. Pass file to uploadFile.
  async function handleAudioFile(file: File | null) {
    if (!file) return;
    try {
      const extension = file.name.split('.').pop(); // Get the file extension
      const fileName = `audiofile-${self.crypto.randomUUID()}.${extension}`;
      await uploadFile('audiofiles', fileName, file);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async function uploadFile(bucketName: string, fileName: string, file: File) {
    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `https://grjecfvldxcnvhmjpvmu.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${accessTokenRef.current}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName,
          objectName: `${userIDRef.current}/${fileName}`,
          contentType: file.type,
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024,
        onError: function (error) {
          console.log('Failed because: ' + error);
          reject(error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setPercentageUploaded(parseFloat(percentage));
          // console.log(bytesUploaded, bytesTotal, percentage + '%');
        },
        onSuccess: async function () {
          setUploadComplete(true);
          try {
            const signedUrl = await getDownloadUrl(fileName);
            // console.log('signedUrl:', signedUrl);

            // Check if signedUrl is defined before setting the state
            if (signedUrl !== undefined) {
              createNote(fileName, signedUrl);
            } else {
              console.error('Error: Signed URL is undefined');
            }
          } catch (error) {
            console.error('Error fetching signed URL:', error);
          }
          resolve(null); // CHECK EFFECT OF NULL
        },
      });

      // Check if there are any previous uploads to continue.
      upload.findPreviousUploads().then(function (previousUploads) {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      });
    });
  }

  async function createNote(audio_storage_url: string, temp_audio_url: string) {
    // fetch default appointment type
    // fetch default appointment specialties
    // fetch default patient location (patient state)
    // fetch default patient (drug) allergies (send to AI model first?)

    const patientProfile = await fetchPatientProfileById(patientId);
    const userSettings = await fetchUserSettings();

    // console.log('calling createNote');
    // console.log(patientProfile, userSettings);

    try {
      const { error, data } = await supabase
        .from('note')
        .insert({
          user_id: userIDRef.current as string,
          audio_storage_url,
          temp_audio_url,
          patient_id: patientId,
          allergies: patientProfile.allergies,
          patient_location: patientProfile.state,
          appointment_type: userSettings.appointment_types_default,
          appointment_specialty: userSettings.appointment_specialties_default,
        })
        .select();

      if (error) {
        console.error('Error inserting into Supabase table:', error);
      }

      //   Call Replicate prediction with webhook
      data && getReplicateMonoTranscript(temp_audio_url, data[0].id);

      // Redirect to page for new note
      data && router.push(`/dashboard/notes`);
    } catch (error) {
      console.error('Failed to upload to Supabase table:', error);
      // Display error message to user
      revalidatePath(`/dashboard/notes`);
    }
  }

  // recorder functions
  const initializeMediaRecorder = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
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

  function startRecording(event: React.MouseEvent) {
    event.stopPropagation();
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
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = -60;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.8;
    const sampleCount = 1024;
    analyser.fftSize = sampleCount;
    const dataArray = new Uint8Array(analyser.fftSize);

    if (!streamRef.current) {
      console.error('stream not found');
      return;
    }

    // Connect the microphone stream to the analyser node
    const microphone = audioContext.createMediaStreamSource(streamRef.current);
    microphone.connect(analyser);

    // Connect to canvas for rendering bars
    const canvas = document.getElementById('visualizer') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    let ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx?.scale(dpr, dpr);
    const barSpace = 12;

    let barArrayLength = Math.floor(canvas.width / barSpace);

    let barArray: number[] = new Array(barArrayLength).fill(0);

    const getBar = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = (Math.max(...dataArray) / 255) * 0.83;

      // console.log(volume);

      barArray.push(volume);

      if (barArray.length * barSpace > canvas.width) {
        barArray.shift();
      }
    };

    // prettier-ignore
    function draw() {
      getBar();

      if (ctx == null) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#f03';
      ctx.lineCap = 'round';
      ctx.lineWidth = dpr * 3;

      
 
      for (let i = 0; i < barArray.length; i++) {
        const barHeight = barArray[i] * canvas.height;

        ctx.beginPath();
        ctx.moveTo(
          i * barSpace,
          canvas.height * 0.25,
        );
        ctx.lineTo(
          i * barSpace,
          canvas.height * 0.25 - barHeight * 0.5,
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i * barSpace, canvas.height * 0.25);
        ctx.lineTo(i * barSpace, canvas.height * 0.25 + barHeight * 0.5);
        ctx.stroke();
      }
    }

    function animate() {
      draw();
      drawVisualRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup resources when visualization stops
      if (drawVisualRef.current !== null) {
        cancelAnimationFrame(drawVisualRef.current);
      }
      audioContext.close();
    };
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
      setStatus('audioAvailable');
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

    // Close the audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }

  function playRecording() {
    if (isAMR) {
      player?.play();
      setStatus('playing');
    } else if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setStatus('playing');
    }
  }

  function pauseRecording() {
    if (isAMR) {
      player?.pause();
      setStatus('audioAvailable');
    } else if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setStatus('audioAvailable');
    }
  }

  function deleteRecording() {
    setAudioUrl('');
    setAudioBlob(null);
    setAudioFile(null);
    setPlayer(null);
    setIsAMR(false);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
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

    if (isAMR) {
      if (player) {
        player.fastSeek(newTime);
        setPlaybackTimeFormatted(formatPlaybackTime(newTime));
      }
    } else if (audioPlayerRef.current) {
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInputClick}
        tabIndex={0}
        className={clsx(
          `grid h-48 w-full max-w-prose grid-rows-4 justify-items-center rounded-md border-2 border-dotted  bg-white p-4`,
          {
            'cursor-pointer': status === 'initial',
            'border-gray-300': !isDragging,
            'border-blue-600': isDragging,
          },
        )}
      >
        <div>
          {status === 'initial' ? (
            <>
              <div className="hidden text-sm font-medium text-gray-700 sm:block">
                Drag and drop or click in this area to upload an audio file.
              </div>
              <div className="text-sm font-medium text-gray-700 sm:hidden">
                Click in this area to upload an audio file.
              </div>
            </>
          ) : status === 'recording' ? (
            `${elapsedRecordingTime}`
          ) : status === 'audioAvailable' || status === 'playing' ? (
            `${playbackTimeFormatted} / ${elapsedRecordingTime}`
          ) : status === 'uploading' ? (
            <div className="loader"></div>
          ) : status === 'uploaded' ? (
            ''
          ) : (
            ''
          )}
        </div>
        <div className="w-5/6 text-center text-sm  text-gray-500">
          {status === 'initial' ? (
            'Tap icon below to record new audio.'
          ) : status === 'recording' ? (
            <canvas
              id="visualizer"
              width={640}
              height={32}
              className="visualizer h-8 w-full"
            ></canvas>
          ) : status === 'audioAvailable' || status === 'playing' ? (
            <input
              type="range"
              min="0"
              max={isAMR ? player?.duration : audioPlayerRef.current?.duration}
              value={
                isAMR
                  ? player?.currentTime
                  : audioPlayerRef.current?.currentTime
              }
              onChange={handleRangeChange}
              className="w-full cursor-pointer accent-gray-600"
            />
          ) : status === 'uploading' ? (
            <div>Upload {percentageUploaded}% complete</div>
          ) : (
            'Redirecting...'
          )}
        </div>
        <div>
          {status === 'initial' && (
            <div className=" flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-teal-600 p-2 shadow transition-all hover:bg-teal-500 active:bg-teal-600">
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
          {status === 'audioAvailable' && (
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
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full  bg-teal-600 p-2 shadow hover:bg-teal-500">
              <Pause
                size={32}
                color="white"
                weight="duotone"
                onClick={pauseRecording}
              />
            </div>
          )}
        </div>
        {status === 'audioAvailable' || status === 'playing' ? (
          <div className="grid w-full grid-cols-2 items-center justify-items-center text-center">
            <div
              className="mr-4 w-24 cursor-pointer rounded-lg border py-1 text-gray-700 transition-colors hover:bg-red-500 hover:text-white sm:mr-0"
              onClick={deleteRecording}
            >
              delete
            </div>
            <div
              className="ml-4 w-24 cursor-pointer rounded-lg border py-1 text-gray-700 transition-colors hover:bg-teal-500 hover:text-white sm:ml-0"
              onClick={handleUploadClick}
            >
              upload
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <audio ref={audioPlayerRef} src={audioUrl} hidden controls></audio>
    </>
  );
};

export default AudioUploadRecordVolumeVis;
