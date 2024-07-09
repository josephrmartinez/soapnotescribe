'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { GeistSans } from 'geist/font/sans';
import { NoteWithPatient } from '@/app/lib/definitions';
import { getSignedAudioUrl } from '@/app/lib/data';
import { updateNote } from './action';
import { DeleteNoteFirstStep } from '@/app/ui/notes/buttons';
import { calculateAge } from '@/app/lib/utils';
import AppointmentTypeSelect from '@/app/ui/notes/AppointmentTypeSelect';
import AppointmentSpecialtySelect from '@/app/ui/notes/AppointmentSpecialtySelect';
import AudioPlayer from '@/app/components/AudioPlayer';
import { SubmitFormButton } from '@/app/ui/Buttons';
import { fetchUserSettings } from '@/app/lib/data';

interface CreateNoteProps {
  note: NoteWithPatient;
}

const EditDraftNote: React.FC<CreateNoteProps> = ({ note }) => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [chiefComplaint, setChiefComplaint] = useState<string | null>(
    note?.chief_complaint || null,
  );
  const [date, setDate] = useState<string>(
    note?.appointment_date || new Date().toISOString().split('T')[0],
  );
  const [appointmentTime, setAppointmentTime] = useState<string>(
    note?.appointment_time || '',
  );
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    note?.patient.date_of_birth || '',
  );
  const [patientAgeYears, setPatientAgeYears] = useState<number>(
    note?.patient_age_years || 0,
  );
  const [allergies, setAllergies] = useState<string>(note?.allergies || '');
  const [consent, setConsent] = useState<boolean | null>(note?.consent || null);
  const [subjective, setSubjective] = useState<string | null>(
    note?.soap_subjective || null,
  );
  const [objective, setObjective] = useState<string | null>(
    note?.soap_objective || null,
  );
  const [assessment, setAssessment] = useState<string | null>(
    note?.soap_assessment || null,
  );
  const [plan, setPlan] = useState<string | null>(note?.soap_plan || null);
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState<
    string | null
  >(note?.differential_diagnosis || null);
  const [doctorSignature, setDoctorSignature] = useState<string>(
    note?.doctor_signature || '',
  );
  const [appointmentType, setAppointmentType] = useState<string>(
    note.appointment_type || '',
  );
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  const [appointmentSpecialty, setAppointmentSpecialty] = useState<string>(
    note.appointment_specialty || '',
  );
  const [appointmentSpecialties, setAppointmentSpecialties] = useState<
    string[]
  >([]);
  const [patientLocation, setPatientLocation] = useState<string>(
    note.patient_location || '',
  );

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

  // On mount: get user settings to pass values to select components
  useEffect(() => {
    const getUserSettings = async () => {
      const userSettings = await fetchUserSettings();
      setAppointmentTypes(userSettings.appointment_types);
      setAppointmentSpecialties(userSettings.appointment_specialties);
    };
    getUserSettings();
  }, []);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (note?.audio_storage_url) {
        try {
          const url = await getSignedAudioUrl(
            note.user_id,
            note.audio_storage_url,
          );
          console.log('signed url:', url);
          setAudioUrl(url);
        } catch (error) {
          console.error('Error fetching audio url:', error);
        }
      }
    };

    fetchAudioUrl();
  }, []);

  // Calculate patientAgeYears based on patient dob and appointment date
  useEffect(() => {
    if (dateOfBirth && date) {
      const age = calculateAge(dateOfBirth, date);
      setPatientAgeYears(age);
    }
  }, [dateOfBirth, date]);

  const saveDraft = updateNote.bind(null, 'awaiting review');
  const approveNote = updateNote.bind(null, 'approved');

  const handleAppointmentTypeChange = (selectedAppointmentType: string) => {
    setAppointmentType(selectedAppointmentType);
  };

  const handleAppointmentSpecialtyChange = (
    selectedAppointmentSpecialty: string,
  ) => {
    setAppointmentSpecialty(selectedAppointmentSpecialty);
  };

  return (
    <div className="w-full">
      {/* <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Review Draft</h1>
      </div> */}
      <form className="max-w-prose">
        <input name="id" hidden defaultValue={note?.id}></input>

        <div className="mb-8 max-w-prose rounded-md bg-gray-50 p-4">
          {/* <div className="mb-8 text-lg font-medium text-gray-800">
            SOAP note
          </div> */}

          <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {/* Patient Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="patient_name"
                className="mb-2 block text-sm font-medium"
              >
                Patient Name
              </label>
              <div className="ml-2 text-sm">
                {note.patient.last_name}, {note.patient.first_name}
                {note.patient.middle_name && note.patient.middle_name}
              </div>
            </div>

            {/* Patient Date of Birth */}
            {note.patient.date_of_birth && (
              <div className="">
                <label
                  htmlFor="appointment_date"
                  className="mb-2 block text-sm font-medium"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="ml-2 text-sm">
                    {note.patient.date_of_birth}
                  </div>
                </div>
              </div>
            )}

            {note.patient.phone && (
              <div className="">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone Number
                </label>
                <div className="ml-2 text-sm">{note.patient.phone}</div>
              </div>
            )}

            {/* Patient Age */}
            {patientAgeYears && (
              <div className="">
                <label
                  htmlFor="patient_age"
                  className="mb-2 block text-sm font-medium"
                >
                  Patient Age
                </label>
                <div className="ml-2 text-sm">
                  <div>{patientAgeYears} years old</div>
                </div>
                <input
                  name="patient_age"
                  id="patient_age"
                  hidden
                  type="number"
                  value={patientAgeYears}
                ></input>
              </div>
            )}

            {note.patient.address_street && (
              <div className="">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium"
                >
                  Street Address
                </label>
                <div className="ml-2 text-sm">
                  <div>{note.patient.address_street}</div>
                  {note.patient.address_unit && (
                    <div>{note.patient.address_unit}</div>
                  )}
                  <div>
                    {note.patient.city}, {note.patient.state}{' '}
                    {note.patient.zipcode}
                  </div>
                </div>
              </div>
            )}

            {note.patient.email && (
              <div className="">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>
                <div className="ml-2 text-sm">{note.patient.email}</div>
              </div>
            )}

            {note.patient.profile_notes && (
              <div className="mb-4">
                <label
                  htmlFor="profilenotes"
                  className="mb-2 block text-sm font-medium"
                >
                  Patient Profile Notes
                </label>

                <div className="ml-2 text-sm">{note.patient.profile_notes}</div>
              </div>
            )}

            {/* Appointment Date */}
            <div className="">
              <label
                htmlFor="appointment_date"
                className="mb-2 block text-sm font-medium"
              >
                Appointment Date
              </label>
              <div className="relative">
                <input
                  id="appointment_date"
                  name="appointment_date"
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                ></input>
              </div>
            </div>

            {/* Appointment Time */}
            <div className="">
              <label
                htmlFor="appointment_time"
                className="mb-2 block text-sm font-medium"
              >
                Appointment Time
              </label>
              <div className="relative">
                <input
                  id="appointment_time"
                  name="appointment_time"
                  required
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                ></input>
              </div>
            </div>

            <div className="">
              <label
                htmlFor="appointment_type"
                className="mb-2 block text-sm font-medium"
              >
                Appointment Type
              </label>
              <AppointmentTypeSelect
                appointmentType={appointmentType}
                appointmentTypes={appointmentTypes}
                setAppointmentType={handleAppointmentTypeChange}
              />
            </div>

            <div className="">
              <label
                htmlFor="appointment_specialty"
                className="mb-2 block text-sm font-medium"
              >
                Appointment Specialty
              </label>
              <AppointmentSpecialtySelect
                appointmentSpecialty={appointmentSpecialty}
                appointmentSpecialties={appointmentSpecialties}
                setAppointmentSpecialty={handleAppointmentSpecialtyChange}
              />
            </div>

            <div className="">
              <label
                htmlFor="patient_location"
                className="mb-2 block text-sm font-medium"
              >
                Patient Location
              </label>
              <div className="relative">
                <input
                  id="patient_location"
                  name="patient_location"
                  required
                  type="text"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                  value={patientLocation || ''}
                  onChange={(e) => setPatientLocation(e.target.value)}
                ></input>
              </div>
            </div>

            {/* Telemedicine Consent */}
            <div className="">
              <label
                htmlFor="consent"
                className="mb-2 block text-sm font-medium"
              >
                Consent
              </label>
              <div className="relative flex flex-row items-center pt-2">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={consent === true}
                  required
                  onChange={(e) => {
                    setConsent(e.target.checked);
                  }}
                  className="peer mr-4 block h-6 w-6 cursor-pointer rounded-md border border-gray-200 text-sm outline-2 "
                ></input>
                <div className="text-sm">Patient consents to treatment.</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="allergies"
              className="mb-2 block text-sm font-medium"
            >
              Allergies
            </label>
            <div className="relative">
              <input
                id="allergies"
                name="allergies"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={allergies || ''}
                onChange={(e) => setAllergies(e.target.value)}
              ></input>
            </div>
          </div>

          <div className="mb-4">
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
            <label
              htmlFor="soap_plan"
              className="mb-2 block text-sm font-medium"
            >
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

          <div className="mb-4">
            <label
              htmlFor="doctor_signature"
              className="mb-2 block text-sm font-medium"
            >
              Doctor Signature
            </label>
            <div className="relative">
              <input
                id="doctor_signature"
                name="doctor_signature"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={doctorSignature || ''}
                onChange={(e) => setDoctorSignature(e.target.value)}
              ></input>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 md:grid-cols-4">
            <Link
              href="/dashboard/notes"
              className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <DeleteNoteFirstStep id={note.id} />

            <SubmitFormButton formAction={saveDraft} active secondary>
              Save Draft
            </SubmitFormButton>

            <SubmitFormButton
              formAction={approveNote}
              className="col-span-3 md:col-span-1"
              active={doctorSignature !== null && doctorSignature.length > 5}
            >
              Approve Note
            </SubmitFormButton>
          </div>
        </div>

        {differentialDiagnosis && (
          <div
            tabIndex={0}
            className="collapse collapse-plus mb-4 rounded-md  border"
          >
            <div className="collapse-title text-lg font-medium text-gray-600">
              Differential Diagnosis
            </div>
            <div className="collapse-content">
              <p className="text-sm">{differentialDiagnosis}</p>
              <p className="mt-6 text-center text-xs italic text-gray-700">
                This differential diagnosis is for reference only and will not
                be included with the approved SOAP note.
              </p>
            </div>
          </div>
        )}

        {note.audio_transcript && (
          <div>
            <div
              tabIndex={0}
              className="collapse-plus collapse my-4 rounded-md border"
            >
              <div className="collapse-title text-lg font-medium text-gray-600">
                Audio Transcript
              </div>
              <div className="collapse-content">
                <p className="text-sm">{note.audio_transcript}</p>
                <p className="mt-6 text-center text-xs italic text-gray-700">
                  Audio transcription is for reference only and will not be
                  included with the approved SOAP note.
                </p>
              </div>
            </div>
            <div className="collapse-title text-lg font-medium text-gray-600">
              Audio
            </div>
            <AudioPlayer audioUrl={audioUrl} />
          </div>
        )}
      </form>
    </div>
  );
};

export default EditDraftNote;
