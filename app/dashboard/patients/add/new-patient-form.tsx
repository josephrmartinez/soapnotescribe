'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/app/ui/button';
import PhoneInput from 'react-phone-number-input';

import {
  CheckIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

export default function NewPatientForm() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [allergies, setAllergies] = useState<string | null>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [profileNotes, setProfileNotes] = useState<string | null>(null);
  const [submitOkay, setSubmitOkay] = useState<boolean>(true);

  const supabase = createClient();
  const router = useRouter();

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
              Patient Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                required
                placeholder="Full name"
                type="text"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
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
              Patient Date of Birth
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
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="451-867-5309"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={phone || ''}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="allergies"
              className="mb-2 block text-sm font-medium"
            >
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
            Home Address
          </label>
          <div className="relative">
            <input
              id="address"
              name="address"
              placeholder="671 Lincoln Ave, Winnetka, IL 60093"
              type="text"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
            ></input>
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
