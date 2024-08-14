'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { GeistSans } from 'geist/font/sans';
import { NoteWithPatient } from '@/app/lib/definitions';
import { getSignedAudioUrl } from '@/app/lib/data';
import AudioPlayer from '@/app/components/AudioPlayer';
import { DeleteNoteFirstStep } from '@/app/ui/notes/buttons';
import { CancelGoBackButton } from '@/app/ui/Buttons';

interface ProcessingNoteProps {
  note: NoteWithPatient;
}

const ProcessingNote: React.FC<ProcessingNoteProps> = ({ note }) => {
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (note?.audio_storage_url) {
        try {
          const url = await getSignedAudioUrl(
            note.user_id,
            note.audio_storage_url,
          );
          setAudioUrl(url);
        } catch (error) {
          console.error('Error fetching audio url:', error);
        }
      }
    };

    fetchAudioUrl();
  }, []);

  return (
    <div className="w-full">
      {/* <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Review Draft</h1>
      </div> */}
      <form className="max-w-prose">
        <input name="id" hidden defaultValue={note?.id}></input>

        <div className="mb-6 ml-4 text-xl font-medium text-gray-800">
          Appointment with {note.patient.first_name} {note.patient.last_name}
        </div>
        <div className="collapse-title text-xl font-medium text-gray-600">
          Audio
        </div>
        <AudioPlayer audioUrl={audioUrl} />
        {note.audio_transcript ? (
          <div>
            <div
              tabIndex={0}
              className="collapse collapse-plus my-4 rounded-md border"
            >
              <div className="collapse-title text-lg font-medium text-gray-600">
                Audio Transcript
              </div>
              <div className="collapse-content">
                <p className="text-sm">{note.audio_transcript}</p>
                <p className="mt-6 text-center text-xs italic text-gray-700">
                  Audio transcription is for reference only and will be deleted
                  once the SOAP note is approved.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-lg font-medium text-gray-600">
              Generating Transcript ...{' '}
            </div>
            <Button>Retry Transcription</Button>
          </div>
        )}
        <div className="mb-12 flex flex-col items-center justify-center">
          <div className="text-md font-medium text-gray-600">
            Generating SOAP note ...
          </div>
          <div className="loading my-4 bg-teal-600"></div>
          <Button>Retry SOAP Note</Button>
        </div>
        <div className="mt-4 grid grid-flow-col gap-6">
          <CancelGoBackButton />

          <DeleteNoteFirstStep id={note.id} />
        </div>
      </form>
    </div>
  );
};

export default ProcessingNote;
