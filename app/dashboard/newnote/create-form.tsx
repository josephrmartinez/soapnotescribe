'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SelectPatient from './SelectPatient';
import { SingleValue, ActionMeta } from 'react-select';
import { createNote } from './action';
import { calculateAge } from '@/app/lib/utils';
import AppointmentTypeSelect from '@/app/ui/notes/AppointmentTypeSelect';
import AppointmentSpecialtySelect from '@/app/ui/notes/AppointmentSpecialtySelect';
import {
  PencilSquareIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import {
  fetchPatientById,
  fetchUserSession,
  fetchUserSettings,
} from '@/app/lib/data';
import CreateableSelectChiefComplaint from './CreateableSelectChiefComplaint';
import { TemplateOption, PatientSelectOption } from '@/app/lib/definitions';
import { SubmitFormButton } from '@/app/ui/Buttons';
import { fetchNoteById } from '@/app/lib/data';
import DynamicAudioUploadRecord from '@/app/components/DynamicAudioUploadRecord';
import { EditPatientProfile } from '@/app/ui/patients/buttons';

const CreateNote = () => {
  const [patientId, setPatientId] = useState<string>('');
  const [firstName, setFirstName] = useState<string | null>('');
  const [middleName, setMiddleName] = useState<string | null>('');
  const [lastName, setLastName] = useState<string | null>('');
  const [dateOfBirth, setDateOfBirth] = useState<string | null>('');
  const [phone, setPhone] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');
  const [addressStreet, setAddressStreet] = useState<string | null>('');
  const [addressUnit, setAddressUnit] = useState<string | null>('');
  const [city, setCity] = useState<string | null>('');
  const [state, setState] = useState<string | null>(null);
  const [zipcode, setZipcode] = useState<string | null>('');
  const [allergies, setAllergies] = useState<string | null>('');
  const [profileNotes, setProfileNotes] = useState<string | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState<string | null>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [time, setTime] = useState<string>('');
  const [consent, setConsent] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);

  const [appointmentSpecialty, setAppointmentSpecialty] = useState<string>('');
  const [appointmentSpecialties, setAppointmentSpecialties] = useState<
    string[]
  >([]);

  const [patientLocation, setPatientLocation] = useState<string>('');
  const [subjective, setSubjective] = useState<string | null>(null);
  const [objective, setObjective] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [patientInstructions, setPatientInstructions] = useState<string | null>(
    null,
  );

  const [doctorSignature, setDoctorSignature] = useState<string | null>(null);
  const [submitOkay, setSubmitOkay] = useState<boolean>(true);
  const [patientAgeYears, setPatientAgeYears] = useState<number | undefined>(1);
  const [selectedPatient, setSelectedPatient] = useState<
    PatientSelectOption | undefined
  >(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<
    TemplateOption | undefined
  >(undefined);
  const accessTokenRef = useRef<string | undefined>('');
  const userIDRef = useRef<string | undefined>('');
  const subjectiveRef = useRef<HTMLTextAreaElement | null>(null);
  const objectiveRef = useRef<HTMLTextAreaElement | null>(null);
  const assessmentRef = useRef<HTMLTextAreaElement | null>(null);
  const planRef = useRef<HTMLTextAreaElement | null>(null);
  const instructionsRef = useRef<HTMLTextAreaElement | null>(null);

  let searchParams = useSearchParams();
  const patientIdFromUrl = searchParams.get('patient');

  const noteRef = searchParams.get('noteRef');

  // On mount: get user settings to pass values to select components
  useEffect(() => {
    const getUserSettings = async () => {
      const userSettings = await fetchUserSettings();
      setAppointmentTypes(userSettings.appointment_types);
      setAppointmentType(userSettings.appointment_types_default);
      setAppointmentSpecialties(userSettings.appointment_specialties);
      setAppointmentSpecialty(userSettings.appointment_specialties_default);
    };
    getUserSettings();
  }, []);

  useEffect(() => {
    const fetchAndSetPatient = async () => {
      if (patientIdFromUrl) {
        try {
          const patient = await fetchPatientById(patientIdFromUrl);
          if (patient) {
            const structuredPatient = {
              value: patient,
              label: `${patient.last_name}, ${patient.first_name}`,
            };
            setSelectedPatient(structuredPatient);
            handlePatientSelect(structuredPatient, {
              action: 'select-option',
              option: structuredPatient,
            });
          }
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      }
    };
    fetchAndSetPatient();
  }, [patientIdFromUrl]);

  useEffect(() => {
    const fetchAndSetNoteRef = async () => {
      if (noteRef) {
        try {
          const note = await fetchNoteById(noteRef);
          console.log('note from noteRef:', note);
          if (note) {
            {
              note.patient_location &&
                setPatientLocation(note.patient_location);
            }
            {
              note.allergies && setAllergies(note.allergies);
            }
            {
              note.appointment_type &&
                setAppointmentType(note.appointment_type);
            }
            {
              note.appointment_specialty &&
                setAppointmentSpecialty(note.appointment_specialty);
            }
            {
              note.chief_complaint &&
                setSelectedTemplate({
                  value: note.chief_complaint,
                  label: note.chief_complaint,
                });
              setChiefComplaint(note.chief_complaint);
            }
            setSubjective(note.soap_subjective);
            setObjective(note.soap_objective);
            setAssessment(note.soap_assessment);
            setPlan(note.soap_plan);
            setPatientInstructions(note.patient_instructions);
          }
        } catch (error) {
          console.error('Error fetching noteRef:', error);
        }
      }
    };
    fetchAndSetNoteRef();
  }, [noteRef]);

  const handlePatientSelect = (
    newValue: SingleValue<PatientSelectOption>,
    actionMeta: ActionMeta<PatientSelectOption>,
  ) => {
    if (newValue) {
      // console.log('newValue', newValue);
      setPatientId(newValue.value.id);
      setFirstName(newValue.value.first_name);
      setMiddleName(newValue.value.middle_name);
      setLastName(newValue.value.last_name);
      setAllergies(newValue.value.allergies);
      setDateOfBirth(newValue.value.date_of_birth);
      setAddressStreet(newValue.value.address_street);
      setAddressUnit(newValue.value.address_unit);
      setCity(newValue.value.city);
      setState(newValue.value.state);
      setZipcode(newValue.value.zipcode);
      setEmail(newValue.value.email);
      setPhone(newValue.value.phone);
      setProfileNotes(newValue.value.profile_notes);
      setPatientLocation(newValue.value.state);
    } else {
      console.log('No new patient value');
    }
  };

  useEffect(() => {
    if (dateOfBirth && date) {
      const age = calculateAge(dateOfBirth, date);
      setPatientAgeYears(age);
    }
  }, [dateOfBirth, date]);

  const autoResizeTextarea = (
    textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>,
  ) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const minHeight = 80;
      textarea.style.height = 'auto';
      const newHeight = Math.max(textarea.scrollHeight + 10, minHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

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

  useEffect(() => {
    autoResizeTextarea(instructionsRef);
  }, [patientInstructions]);

  const handleAppointmentTypeChange = (selectedAppointmentType: string) => {
    setAppointmentType(selectedAppointmentType);
  };

  const handleAppointmentSpecialtyChange = (
    selectedAppointmentSpecialty: string,
  ) => {
    setAppointmentSpecialty(selectedAppointmentSpecialty);
  };

  const handleTemplateSelect = (
    selectedTemplate: TemplateOption,
    actionMeta?: ActionMeta<TemplateOption>,
  ) => {
    setChiefComplaint(selectedTemplate.label);
    // console.log(selectedTemplate);
    if (typeof selectedTemplate.value === 'object') {
      setSubjective(selectedTemplate.value.soap_subjective);
      setObjective(selectedTemplate.value.soap_objective);
      setAssessment(selectedTemplate.value.soap_assessment);
      setPlan(selectedTemplate.value.soap_plan);
      setPatientInstructions(selectedTemplate.value.patient_instructions);
    }
  };

  const submitDraftNote = createNote.bind(null, 'draft');
  const submitApprovedNote = createNote.bind(null, 'approved');

  return (
    <form>
      <div className="max-w-prose rounded-md bg-gray-50 p-4">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
          <div className="">
            <label className="mb-2 block text-sm font-medium">Patient</label>
            <SelectPatient
              onPatientSelect={handlePatientSelect}
              selectedPatient={selectedPatient}
            />
            <input name="patient_id" hidden defaultValue={patientId}></input>
            {firstName && (
              <input name="first_name" hidden defaultValue={firstName}></input>
            )}
            {middleName && (
              <input
                name="middle_name"
                hidden
                defaultValue={middleName}
              ></input>
            )}
            {lastName && (
              <input name="last_name" hidden defaultValue={lastName}></input>
            )}
          </div>

          <div className="flex flex-row items-center sm:mt-7">
            {patientId === '' ? (
              <Link
                href={'./patients/add'}
                className="flex h-10 items-center rounded-lg border px-4 text-sm font-medium text-gray-600 transition-colors  hover:bg-teal-600 hover:text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600"
              >
                <PlusIcon width={22} className="mr-2" />
                Add New Patient
              </Link>
            ) : (
              <EditPatientProfile patient_id={patientId} />
            )}
          </div>
        </div>

        <div className={`${patientId === '' ? 'hidden' : ''}`}>
          <div className="mb-8 grid grid-cols-2 gap-8">
            {/* Patient Date of Birth */}
            <div className="">
              <label
                htmlFor="appointment_date"
                className="mb-2 block text-sm font-medium"
              >
                Date of Birth
              </label>
              <div className="relative">
                <div className="ml-2 text-sm">{dateOfBirth}</div>
              </div>
            </div>
            {/* Patient Age */}
            <div className="">
              <label
                htmlFor="patient_age"
                className="mb-2 block text-sm font-medium"
              >
                Patient Age
              </label>
              <div className="ml-2 text-sm">
                {patientAgeYears && <div>{patientAgeYears} years old</div>}
              </div>
              <input
                name="patient_age"
                id="patient_age"
                hidden
                type="number"
                value={patientAgeYears}
              ></input>
            </div>

            {phone && (
              <div className="">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone Number
                </label>
                <div className="ml-2 text-sm">{phone}</div>
              </div>
            )}

            {email && (
              <div className="">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>
                <div className="ml-2 text-sm">{email}</div>
              </div>
            )}

            {addressStreet && (
              <div className="">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium"
                >
                  Street Address
                </label>
                <div className="ml-2 text-sm">
                  <div>{addressStreet}</div>
                  {addressUnit && <div>{addressUnit}</div>}
                  <div>
                    {city}, {state} {zipcode}
                  </div>
                </div>
              </div>
            )}

            {allergies && (
              <div className="">
                <label
                  htmlFor="allergies"
                  className="mb-2 block text-sm font-medium"
                >
                  Allergies
                </label>
                <div className="ml-2 text-sm">{allergies}</div>
              </div>
            )}
          </div>

          {profileNotes && (
            <div className="">
              <label
                htmlFor="profilenotes"
                className="mb-2 block text-sm font-medium"
              >
                Patient Profile Notes
              </label>

              <div className="ml-2 text-sm">{profileNotes}</div>
            </div>
          )}

          <div className="text-md mb-8 block border-b font-medium">
            Generate Note from Audio:
          </div>

          <div className="mb-8 px-2">
            <div className="mb-2 block text-sm font-medium">Audio Input</div>
            <DynamicAudioUploadRecord patientId={patientId} />
          </div>

          <div className="text-md mb-8 block border-b font-medium">
            Write Note Manually:
          </div>

          <div className="px-2">
            <div className=" mb-4 grid grid-cols-1 gap-x-8 gap-y-4  sm:grid-cols-2">
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
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
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
                  appointmentTypes={appointmentTypes}
                  appointmentType={appointmentType}
                  setAppointmentType={handleAppointmentTypeChange}
                />
              </div>
              {/* appointment specialty */}
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
              {/* patient location */}
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
              {/* consent */}
              <div className="">
                <label
                  htmlFor="consent"
                  className="mb-2 block text-sm font-medium"
                >
                  Consent
                </label>
                <div className="relative flex h-9 flex-row items-center">
                  <input
                    id="consent"
                    name="consent"
                    required
                    type="checkbox"
                    value="true"
                    // if checked, value is true. if unchecked, value is false
                    onChange={(e) => setConsent(e.target.value)}
                    className="peer mr-4 block h-6 w-6 cursor-pointer rounded-md border border-gray-200 text-sm outline-2 "
                  ></input>
                  <div className="text-sm">Patient consents to treatment.</div>
                </div>
              </div>
            </div>
            {/* Allergies */}
            {/* <div className="mb-4">
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
                  required
                  type="text"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                  value={allergies || ''}
                  onChange={(e) => setAllergies(e.target.value)}
                ></input>
              </div>
            </div> */}
            <div className="mb-4 w-full lg:w-1/2">
              <label
                htmlFor="chief_complaint"
                className="mb-2 block text-sm font-medium"
              >
                Chief Complaint
              </label>
              <div className="relative">
                <CreateableSelectChiefComplaint
                  onTemplateSelect={handleTemplateSelect}
                  selectedTemplate={selectedTemplate}
                />
              </div>
              {chiefComplaint && (
                <input
                  name="chief_complaint"
                  hidden
                  defaultValue={chiefComplaint}
                ></input>
              )}
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
                  ref={subjectiveRef}
                  name="soap_subjective"
                  className="w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
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
                  ref={objectiveRef}
                  name="soap_objective"
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
                  className="block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                  value={plan || ''}
                  onChange={(e) => setPlan(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="patient_instructions"
                className="mb-2 block text-sm font-medium"
              >
                Patient Instructions
              </label>
              <div className="relative">
                <textarea
                  id="patient_instructions"
                  name="patient_instructions"
                  ref={instructionsRef}
                  className="block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                  value={patientInstructions || ''}
                  onChange={(e) => setPatientInstructions(e.target.value)}
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
            <div className="mt-6 grid grid-cols-2  gap-4 sm:grid-cols-3">
              <Link
                href="/dashboard/notes"
                className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </Link>
              <SubmitFormButton formAction={submitDraftNote} secondary active>
                Save Draft
              </SubmitFormButton>
              <SubmitFormButton
                className="col-span-2 sm:col-span-1"
                formAction={submitApprovedNote}
                active={doctorSignature !== null && doctorSignature.length > 5}
              >
                Approve Note
              </SubmitFormButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateNote;
