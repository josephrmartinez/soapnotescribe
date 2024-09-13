'use client';

import { useState, useEffect } from 'react';
import { NoteWithPatient } from '@/app/lib/definitions';
import CopyTextButton from '../buttons/CopyTextButton';

export default function NoteContent({ note }: { note: NoteWithPatient }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopiedId(id);
  };

  useEffect(() => {
    // Cleanup function to clear the clipboard on component unmount
    return () => {
      navigator.clipboard.writeText('').catch((err) => {
        console.error('Failed to clear clipboard: ', err);
      });
    };
  }, []);

  return (
    <div>
      {/* Chief Complaint */}
      <div className="mb-4">
        <div className="flex w-full justify-between">
          <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
            Chief Complaint
          </label>
          <CopyTextButton
            inputText={note.chief_complaint || ''}
            buttonText="Copy Chief Complaint"
            copied={copiedId === 'chiefComplaint'}
            onCopy={() => handleCopy('chiefComplaint')}
          />
        </div>
        <div id="complaint" className="ml-2 text-sm">
          {note.chief_complaint}
        </div>
      </div>

      {/* Subjective */}
      <div className="mb-4">
        <div className="flex w-full justify-between">
          <label
            htmlFor="subjective"
            className="mb-2 block text-sm font-medium"
          >
            Subjective
          </label>
          <CopyTextButton
            inputText={note.soap_subjective || ''}
            buttonText="Copy Subjective"
            copied={copiedId === 'subjective'}
            onCopy={() => handleCopy('subjective')}
          />
        </div>
        <div id="subjective" className="whitespace-pre-wrap px-2  text-sm">
          {note.soap_subjective}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex w-full justify-between">
          <label htmlFor="objective" className="mb-2 block text-sm font-medium">
            Objective
          </label>
          <CopyTextButton
            inputText={note.soap_objective || ''}
            buttonText="Copy Chief Complaint"
            copied={copiedId === 'objective'}
            onCopy={() => handleCopy('objective')}
          />
        </div>
        <div className="relative">
          <div id="objective" className="whitespace-pre-wrap px-2 text-sm">
            {note.soap_objective || ''}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex w-full justify-between">
          <label
            htmlFor="assessment"
            className="mb-2 block text-sm font-medium"
          >
            Assessment
          </label>
          <CopyTextButton
            inputText={note.soap_assessment || ''}
            buttonText="Copy Assessment"
            copied={copiedId === 'assessment'}
            onCopy={() => handleCopy('assessment')}
          />
        </div>
        <div className="relative">
          <div id="assessment" className="whitespace-pre-wrap px-2 text-sm">
            {note.soap_assessment || ''}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex w-full justify-between">
          <label
            htmlFor="plan"
            className="mb-2 block whitespace-pre-wrap text-sm font-medium"
          >
            Plan
          </label>
          <CopyTextButton
            inputText={note.soap_plan || ''}
            buttonText="Copy Plan"
            copied={copiedId === 'plan'}
            onCopy={() => handleCopy('plan')}
          />
        </div>
        <div className="relative">
          <div id="plan" className="whitespace-pre-wrap px-2 text-sm">
            {note.soap_plan || ''}
          </div>
        </div>
      </div>

      {note.patient_instructions && (
        <div className="mb-4">
          <div className="flex w-full justify-between">
            <label
              htmlFor="plan"
              className="mb-2 block whitespace-pre-wrap text-sm font-medium"
            >
              Patient Instructions
            </label>
            <CopyTextButton
              inputText={note.patient_instructions || ''}
              buttonText="Copy Patient Instructions"
              copied={copiedId === 'patientInstructions'}
              onCopy={() => handleCopy('patientInstructions')}
            />
          </div>
          <div className="relative">
            <div
              id="patient_instructions"
              className="whitespace-pre-wrap px-2 text-sm"
            >
              {note.patient_instructions || ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
