'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { CancelGoBackButton } from '../Buttons';
import { Button } from '../button';
import { SubmitFormButton } from '../Buttons';

interface TemplateFormProps {
  template?: Template;
  formAction: (formData: FormData) => Promise<void>;
}

interface Template {
  id: string;
  chief_complaint: string;
  soap_subjective: string;
  soap_objective: string;
  soap_assessment: string;
  soap_plan: string;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  formAction,
}) => {
  const [chiefComplaint, setChiefComplaint] = useState<string | null>(
    template?.chief_complaint || null,
  );
  const [subjective, setSubjective] = useState<string | null>(
    template?.soap_subjective || null,
  );
  const [objective, setObjective] = useState<string | null>(
    template?.soap_objective || null,
  );
  const [assessment, setAssessment] = useState<string | null>(
    template?.soap_assessment || null,
  );
  const [plan, setPlan] = useState<string | null>(template?.soap_plan || null);

  // Ref declarations with types
  const subjectiveRef = useRef<HTMLTextAreaElement | null>(null);
  const objectiveRef = useRef<HTMLTextAreaElement | null>(null);
  const assessmentRef = useRef<HTMLTextAreaElement | null>(null);
  const planRef = useRef<HTMLTextAreaElement | null>(null);

  // Refactored autoResizeTextarea function with type
  const autoResizeTextarea = (
    textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>,
  ) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset the height
      textarea.style.height = `${textarea.scrollHeight + 10}px`; // Set the height to scrollHeight
    }
  };

  // useEffect hooks for each textarea
  useEffect(() => {
    autoResizeTextarea(subjectiveRef);
  }, [subjective]);

  useEffect(() => {
    autoResizeTextarea(objectiveRef);
  }, [objective]);

  useEffect(() => {
    autoResizeTextarea(assessmentRef);
  }, [assessment]);

  useEffect(() => {
    autoResizeTextarea(planRef);
  }, [plan]);

  return (
    <form>
      <div className="max-w-prose rounded-md bg-gray-50 p-4">
        <div className="mb-4">
          {template && (
            <input hidden name="id" defaultValue={template.id}></input>
          )}
          <label
            htmlFor="chief_complaint"
            className="mb-2 block text-sm font-medium"
          >
            Chief Complaint
          </label>
          <div className="relative">
            <input
              id="chief_complaint"
              name="chief_complaint"
              required
              type="text"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={chiefComplaint || ''}
              onChange={(e) => setChiefComplaint(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="soap_subjective"
            className="mb-2 block text-sm font-medium"
          >
            Subjective
          </label>
          <div className="relative">
            <textarea
              id="soap_subjective"
              name="soap_subjective"
              ref={subjectiveRef}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={subjective || ''}
              onChange={(e) => setSubjective(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="soap_objective"
            className="mb-2 block text-sm font-medium"
          >
            Objective
          </label>
          <div className="relative">
            <textarea
              id="soap_objective"
              name="soap_objective"
              ref={objectiveRef}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={objective || ''}
              onChange={(e) => setObjective(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="soap_assessment"
            className="mb-2 block text-sm font-medium"
          >
            Assessment
          </label>
          <div className="relative">
            <textarea
              id="soap_assessment"
              name="soap_assessment"
              ref={assessmentRef}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={assessment || ''}
              onChange={(e) => setAssessment(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="soap_plan" className="mb-2 block text-sm font-medium">
            Plan
          </label>
          <div className="relative">
            <textarea
              id="soap_plan"
              name="soap_plan"
              ref={planRef}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={plan || ''}
              onChange={(e) => setPlan(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div>
          <div className="mt-6 flex justify-end gap-4">
            <CancelGoBackButton />
            <SubmitFormButton active={true} formAction={formAction}>
              {template ? 'Update Template' : 'Add Template'}
            </SubmitFormButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TemplateForm;
