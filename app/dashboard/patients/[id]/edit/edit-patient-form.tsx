'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/app/ui/button';
import PhoneInput from '@/app/ui/patients/PhoneInput';
import StateSelect from '@/app/ui/patients/StateSelect';
import ProvinceSelect from '@/app/ui/patients/ProvinceSelect';
import { OptionProps } from 'react-select';
import { revalidatePath } from 'next/cache';
import { editPatient } from './action';
import { formatDateToLocal, calculateAge } from '@/app/lib/utils';

import {
  CheckIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { SubmitButton } from '@/app/ui/SubmitButton';

interface EditPatientProps {
  patient: Patient;
}

interface Patient {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string;
  phone: string | null;
  email: string;
  address_street: string | null;
  address_unit: string | null;
  city: string | null;
  state: string | undefined;
  country: string;
  zipcode: string | null;
  allergies: string | null;
  profile_notes: string | null;
}

const EditPatientForm: React.FC<EditPatientProps> = ({ patient }) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(
    patient?.first_name || null,
  );
  const [middleName, setMiddleName] = useState<string | null>(
    patient?.middle_name || null,
  );
  const [lastName, setLastName] = useState<string | null>(
    patient?.last_name || null,
  );
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    patient?.date_of_birth,
  );
  const [phone, setPhone] = useState<string | null>(patient?.phone);
  const [email, setEmail] = useState<string>(patient?.email);
  const [addressStreet, setAddressStreet] = useState<string | null>(
    patient?.address_street,
  );
  const [addressUnit, setAddressUnit] = useState<string | null>(
    patient?.address_unit,
  );
  const [city, setCity] = useState<string | null>(patient?.city);
  const [state, setState] = useState<string | undefined>(patient?.state);
  const [country, setCountry] = useState<string>(patient?.country);

  const [zipcode, setZipcode] = useState<string | null>(patient?.zipcode);
  const [allergies, setAllergies] = useState<string | null>(patient?.allergies);
  const [profileNotes, setProfileNotes] = useState<string | null>(
    patient?.profile_notes,
  );
  const [submitOkay, setSubmitOkay] = useState<boolean>(true);

  const patientDOB = formatDateToLocal(patient.date_of_birth);
  const dateToday = new Date();
  const patientAge = calculateAge(patientDOB, dateToday.toString());

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
  };

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
  };

  const handlePhoneChange = (phone: string) => {
    setPhone(phone);
  };

  return (
    <form action={editPatient}>
      <div className="max-w-prose rounded-md bg-gray-50 p-4">
        <input name="id" hidden defaultValue={patient?.id}></input>
        <div className="grid grid-cols-2 gap-8">
          <div className="">
            <label
              htmlFor="first_name"
              className="mb-2 block text-sm font-medium"
            >
              First Name
            </label>
            <div className="relative">
              <input
                id="first_name"
                name="first_name"
                placeholder="First name"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={firstName || ''}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
              <UserCircleIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="">
            <label
              htmlFor="middle_name"
              className="mb-2 block text-sm font-medium"
            >
              Middle Name
            </label>
            <div className="relative">
              <input
                id="middle_name"
                name="middle_name"
                placeholder="Middle name"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={middleName || ''}
                onChange={(e) => setMiddleName(e.target.value)}
              ></input>
              <UserCircleIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="">
            <label
              htmlFor="last_name"
              className="mb-2 block text-sm font-medium"
            >
              Last Name
            </label>
            <div className="relative">
              <input
                id="last_name"
                name="last_name"
                placeholder="Last name"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={lastName || ''}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
              <UserCircleIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Patient Date of Birth */}
          <div className="">
            <label
              htmlFor="date_of_birth"
              className="mb-2 block text-sm font-medium"
            >
              Date of Birth
            </label>
            <div className="relative">
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              ></input>
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="">
            <label
              htmlFor="patient_age"
              className="mb-2 block text-sm font-medium"
            >
              Patient Age
            </label>
            <div className="ml-2 text-sm">
              <div>{patientAge} years old</div>
            </div>
          </div>

          <div className="">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <div className="relative">
              <PhoneInput phone={phone} setPhone={handlePhoneChange} />
            </div>
          </div>

          <div className="">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
          </div>

          <div className="">
            <label
              htmlFor="address_street"
              className="mb-2 block text-sm font-medium"
            >
              Street Address
            </label>
            <div className="relative">
              <input
                id="address_street"
                name="address_street"
                placeholder="671 Lincoln Ave"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={addressStreet || ''}
                onChange={(e) => setAddressStreet(e.target.value)}
              ></input>
            </div>
          </div>

          <div className="">
            <label
              htmlFor="address_unit"
              className="mb-2 block text-sm font-medium"
            >
              Apartment, suite, etc.
            </label>
            <div className="relative">
              <input
                id="address_unit"
                name="address_unit"
                placeholder="optional"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={addressUnit || ''}
                onChange={(e) => setAddressUnit(e.target.value)}
              ></input>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* City or Town */}
          <div className="mb-4">
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              City or Town
            </label>
            <div className="relative">
              <input
                id="city"
                name="city"
                type="text"
                value={city || ''}
                placeholder="Winnetka"
                onChange={(e) => setCity(e.target.value)}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              ></input>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="state" className="mb-2 block text-sm font-medium">
              {country === 'Canada' ? 'Province / Territory' : 'State'}
            </label>
            <div className="relative">
              {country === 'United States' ? (
                <StateSelect state={state} setState={handleStateChange} />
              ) : (
                <ProvinceSelect
                  province={state}
                  setProvince={handleStateChange}
                />
              )}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="zipcode" className="mb-2 block text-sm font-medium">
              {country === 'Canada' ? 'Postal code' : 'Zip code'}
            </label>
            <div className="relative">
              <input
                id="zipcode"
                name="zipcode"
                type="text"
                value={zipcode || ''}
                placeholder="60093"
                maxLength={10}
                onChange={(e) => setZipcode(e.target.value)}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              ></input>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="allergies" className="mb-2 block text-sm font-medium">
            Allergies
          </label>
          <div className="relative">
            <input
              id="allergies"
              name="allergies"
              type="text"
              placeholder="optional"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={allergies || ''}
              onChange={(e) => setAllergies(e.target.value)}
            ></input>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="profile_notes"
            className="mb-2 block text-sm font-medium"
          >
            Patient Profile Notes
          </label>
          <div className="relative">
            <textarea
              id="profile_notes"
              name="profile_notes"
              placeholder="optional"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={profileNotes || ''}
              onChange={(e) => setProfileNotes(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/patients"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <SubmitButton active={submitOkay}>Update Patient</SubmitButton>
        </div>
      </div>
    </form>
  );
};

export default EditPatientForm;
