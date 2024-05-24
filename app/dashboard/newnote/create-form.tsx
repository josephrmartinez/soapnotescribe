'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/app/ui/button';
import SelectPatient from './SelectPatient';
import { SingleValue, ActionMeta } from 'react-select';
import { submitNote, submitNoteDraft } from './action';

import {
  CheckIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  UserCircleIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_street: string;
  address_unit: string;
  city: string;
  state: string;
  zipcode: string;
  provider: string;
  date_of_birth: string;
  allergies: string;
  profile_notes: string;
}

interface PatientOption {
  value: Patient;
  label: string;
}

export default function CreateAppointment() {
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [phone, setPhone] = useState<string | null>('');
  const [email, setEmail] = useState<string>('');
  const [addressStreet, setAddressStreet] = useState<string | null>('');
  const [addressUnit, setAddressUnit] = useState<string | null>('');
  const [city, setCity] = useState<string | null>('');
  const [state, setState] = useState<string | null>(null);
  const [zipcode, setZipcode] = useState<string | null>('');
  const [allergies, setAllergies] = useState<string>('');
  const [profileNotes, setProfileNotes] = useState<string | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState<string | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [consent, setConsent] = useState<string | null>(null);
  const [subjective, setSubjective] = useState<string | null>(null);
  const [objective, setObjective] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [doctorSignature, setDoctorSignature] = useState<string | null>(null);
  const [submitOkay, setSubmitOkay] = useState<boolean>(true);
  const accessTokenRef = useRef<string | undefined>('');
  const userIDRef = useRef<string | undefined>('');

  const supabase = createClient();
  const router = useRouter();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data, error } = await supabase.auth.getSession();
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       userIDRef.current = data.session?.user.id;
  //       accessTokenRef.current = data.session?.access_token;
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // const submitNote = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     setLoading(true);
  //     const { error, data } = await supabase.from('notes').insert({
  //       status: 'approved',
  //       appointment_date: date,
  //       user_id: userIDRef.current,
  //       appointment_time: time,
  //       patient_id: patientId,
  //       allergies: allergies,
  //       consent: consent,
  //       chief_complaint: chiefComplaint,
  //       soap_objective: objective,
  //       soap_subjective: subjective,
  //       soap_assessment: assessment,
  //       soap_plan: plan,
  //       doctor_signature: signature,
  //     });
  //     if (error) throw error;
  //     router.push('/dashboard/notes');
  //   } catch (error) {
  //     console.error('Error creating the appointment:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const submitNoteDraft = async (
  //   event: React.MouseEvent<HTMLButtonElement>,
  // ): Promise<void> => {
  //   // event.preventDefault();

  //   try {
  //     setLoading(true);
  //     const { error, data } = await supabase.from('notes').insert({
  //       status: 'awaiting review',
  //       appointment_date: date,
  //       appointment_time: time,
  //       patient_id: patientId,
  //       allergies: allergies,
  //       consent: consent,
  //       chief_complaint: chiefComplaint,
  //       soap_objective: objective,
  //       soap_subjective: subjective,
  //       soap_assessment: assessment,
  //       soap_plan: plan,
  //       doctor_signature: signature,
  //     });
  //     if (error) throw error;
  //     router.push('/dashboard/notes');
  //   } catch (error) {
  //     console.error('Error creating the appointment draft:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePatientSelect = (
    newValue: SingleValue<PatientOption>,
    actionMeta: ActionMeta<PatientOption>,
  ) => {
    if (newValue) {
      setPatientId(newValue.value.id);
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
    } else {
      console.log('No new patient value');
    }
  };

  // UPDATE COMPONENT TO HANDLE RETURNED VALUE FROM SELECT:
  //   {
  //     "id": "a32ec381-ffa0-4803-82a1-50254cde2af5",
  //     "first_name": "Paul",
  //     "last_name": "Giamedes",
  //     "email": "pgiamedes@gmx.de",
  //     "phone": "415-668-7985",
  //     "address_street": "612 West Alameda",
  //     "address_unit": "Unit 12",
  //     "city": "Oakland",
  //     "state": "California",
  //     "zipcode": "94216",
  //     "provider": "6e6d2d8f-2200-4ae3-8335-f88d72c23eb9",
  //     "date_of_birth": "1974-09-15",
  //     "allergies": "NKDA",
  //     "profile_notes": null
  // }

  return (
    <form>
      <div className="max-w-prose rounded-md bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-8">
          <div className="mb-4">
            <label htmlFor="patient" className="mb-2 block text-sm font-medium">
              Patient
            </label>
            <SelectPatient onPatientSelect={handlePatientSelect} />
            <input name="patient_id" hidden defaultValue={patientId}></input>
          </div>

          <div className="mt-3 flex flex-row items-center">
            {patientId === '' ? (
              <Link
                href={'./patients/add'}
                className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600"
              >
                <PlusIcon width={22} className="mr-2" />
                add new patient
              </Link>
            ) : (
              <Link
                href={`./patients/${patientId}/edit`}
                className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600"
              >
                <PencilSquareIcon width={22} className="mr-2" />
                <div>edit patient info</div>
              </Link>
            )}
          </div>
        </div>

        <div className={`${patientId === '' ? 'hidden' : ''}`}>
          <div className="grid grid-cols-2 gap-8">
            {/* Patient Date of Birth */}
            <div className="mb-4">
              <label
                htmlFor="appointment_date"
                className="mb-2 block text-sm font-medium"
              >
                Date of Birth
              </label>
              <div className="relative">
                <div>{dateOfBirth}</div>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <div className="relative">{phone}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative">{email}</div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="complaint"
                className="mb-2 block text-sm font-medium"
              >
                Street Address
              </label>
              <div className="relative">
                <div>{addressStreet}</div>
                {addressUnit && <div>{addressUnit}</div>}
                <div>
                  {city}, {state} {zipcode}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="profilenotes"
              className="mb-2 block text-sm font-medium"
            >
              Patient Profile Notes
            </label>
            <div className="relative">
              <textarea
                id="profile_notes"
                name="profile_notes"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={profileNotes || ''}
                onChange={(e) => setProfileNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Allergies */}
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
                required
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={allergies || ''}
                onChange={(e) => setAllergies(e.target.value)}
              ></input>
            </div>
          </div>

          {/* Telemedicine Consent */}
          <div className="mb-4">
            <label htmlFor="consent" className="mb-2 block text-sm font-medium">
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

        <div className="grid grid-cols-2 gap-8">
          {/* Appointment Date */}
          <div className="mb-4">
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
          <div className="mb-4">
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

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/notes"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button formAction={submitNoteDraft} secondary>
            Save Draft
          </Button>
          <Button
            type="submit"
            formAction={submitNote}
            active={doctorSignature !== null}
          >
            Add Note
          </Button>
        </div>
      </div>
    </form>
  );
}
