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
  const [lastName, setLastName] = useState<string | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [allergies, setAllergies] = useState<string | null>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [state, setState] = useState<string | null>(null);

  const [profileNotes, setProfileNotes] = useState<string | null>(null);
  const [submitOkay, setSubmitOkay] = useState<boolean>(true);

  const supabase = createClient();
  const router = useRouter();

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
  };

  const addPatient = async (formData: FormData) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('patients').insert({
        name: name,
        date_of_birth: dateOfBirth,
        phone: phone,
        email: email,
        address: address,
        allergies: allergies,
        profile_notes: profileNotes,
      });
      if (error) throw error;
      setLoading(false);

      router.push('/dashboard/patients');
    } catch (error) {
      console.error('Error creating new patient:', error);
    } finally {
      setLoading(false);
    }
  };

  // const submitAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     setLoading(true);
  //     const { error, data } = await supabase
  //       .from('appointments')
  //       .insert({
  //         created_at: new Date().toISOString(),
  //       })
  //       .select();
  //     if (error) throw error;
  //     router.push('/dashboard/appointments');
  //   } catch (error) {
  //     console.error('Error creating the appointment:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        </div>

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
          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <div className="relative">
              {/* <input
                id="phone"
                name="phone"
                type="text"
                placeholder="123-123-1234"
                maxLength={12}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={phone || ''}
                onChange={(e) => {
                  // Remove non-numeric characters and separate
                  let numericValue = e.target.value
                    .replace(/\D/g, '')
                    .split('');

                  // Insert in dashes at right places
                  if (numericValue.length > 2) numericValue.splice(3, 0, '-');

                  if (numericValue.length > 6) numericValue.splice(7, 0, '-');

                  // Join back as string and assign as phone value
                  setPhone(numericValue.join(''));
                }}
              ></input> */}
              <PhoneInput />
            </div>
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

        <div className="mb-4">
          <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
            Street Address
          </label>
          <div className="relative">
            <input
              id="address"
              name="address"
              placeholder="671 Lincoln Ave"
              type="text"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
            ></input>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="complaint" className="mb-2 block text-sm font-medium">
            Apartment, suite, etc.
          </label>
          <div className="relative">
            <input
              id="address_two"
              name="address_two"
              placeholder="optional"
              type="text"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
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
                value={dateOfBirth}
                placeholder="Winnetka"
                onChange={(e) => setDateOfBirth(e.target.value)}
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
                value={dateOfBirth}
                placeholder="60093"
                onChange={(e) => setDateOfBirth(e.target.value)}
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
