'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/app/ui/button';
import PhoneInput from '@/app/ui/patients/PhoneInput';
import StateSelect from '@/app/ui/patients/StateSelect';
import { OptionProps } from 'react-select';

import {
  CheckIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

export default function NewPatientForm() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [middleName, setMiddleName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [phone, setPhone] = useState<string | null>('');
  const [email, setEmail] = useState<string>('');
  const [addressStreet, setAddressStreet] = useState<string | null>('');
  const [addressUnit, setAddressUnit] = useState<string | null>('');
  const [city, setCity] = useState<string | null>('');
  const [state, setState] = useState<string | null>(null);
  const [zipcode, setZipcode] = useState<string | null>('');
  const [allergies, setAllergies] = useState<string | null>('');
  const [profileNotes, setProfileNotes] = useState<string | null>(null);
  const [submitOkay, setSubmitOkay] = useState<boolean>(true);

  const supabase = createClient();
  const router = useRouter();

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
  };

  const handlePhoneChange = (phone: string) => {
    setPhone(phone);
  };

  const addPatient = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from('patient').insert({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        phone: phone,
        email: email,
        address_street: addressStreet,
        address_unit: addressUnit,
        city: city,
        state: state,
        zipcode: zipcode,
        allergies: allergies,
        profile_notes: profileNotes,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error creating new patient:', error);
    } finally {
      setLoading(false);
      router.push('/dashboard/patients');
    }
  };

  return (
    <form>
      <div className="max-w-prose rounded-md bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-8">
          <div className="mb-4">
            <label htmlFor="patient" className="mb-2 block text-sm font-medium">
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
          <div className="mb-4">
            <label htmlFor="patient" className="mb-2 block text-sm font-medium">
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
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="mb-4">
            <label htmlFor="patient" className="mb-2 block text-sm font-medium">
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
          <div className="mb-4">
            <label
              htmlFor="appointment_date"
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
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <div className="relative">
              {/* UPDATE TO PASS PHONE VALUE AND SETPHONE PROPS */}
              <PhoneInput phone={phone} setPhone={handlePhoneChange} />
            </div>
          </div>
          <div className="mb-4">
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
        </div>

        <div className="mb-4">
          <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
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

        <div className="mb-4">
          <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
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
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              State
            </label>
            <div className="relative">
              <StateSelect onChange={handleStateChange} />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              Zip code
            </label>
            <div className="relative">
              <input
                id="zip"
                name="zip"
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
            htmlFor="profilenotes"
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
          <Button type="submit" formAction={addPatient} active={submitOkay}>
            Add Patient
          </Button>
        </div>
      </div>
    </form>
  );
}
