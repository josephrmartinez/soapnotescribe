'use client';
import React, { useState } from 'react';
import PhoneInput from '@/app/ui/patients/PhoneInput';
import StateSelect from '@/app/ui/patients/StateSelect';
import CanadaProvinceSelect from '@/app/ui/patients/CanadaProvinceSelect';
import CountrySelect from '@/app/ui/patients/CountrySelect';
import { CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { CancelGoBackButton } from '@/app/ui/Buttons';
import { SubmitFormButton, AddPatientFormButton } from '@/app/ui/Buttons';
import { EditPatientProfile } from './buttons';
import {
  editPatient,
  checkForExistingPatient,
  addPatient,
} from '@/app/lib/data';

interface PatientFormProps {
  patient?: Patient;
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
  referral_source: string | null;
  pharmacy_name: string | null;
  pharmacy_phone: string | null;
}

interface ExistingPatient {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient }) => {
  const [loading, setLoading] = useState(false);
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
    patient?.date_of_birth || '',
  );
  const [phone, setPhone] = useState<string | null>(patient?.phone || '');
  const [email, setEmail] = useState<string>(patient?.email || '');
  const [addressStreet, setAddressStreet] = useState<string | null>(
    patient?.address_street || '',
  );
  const [addressUnit, setAddressUnit] = useState<string | null>(
    patient?.address_unit || '',
  );
  const [city, setCity] = useState<string | null>(patient?.city || '');
  const [state, setState] = useState<string | undefined>(patient?.state);
  const [country, setCountry] = useState<string>(patient?.country || '');

  const [zipcode, setZipcode] = useState<string | null>(patient?.zipcode || '');
  const [allergies, setAllergies] = useState<string | null>(
    patient?.allergies || '',
  );
  const [profileNotes, setProfileNotes] = useState<string | null>(
    patient?.profile_notes || '',
  );
  const [referralSource, setReferralSource] = useState<string | null>(
    patient?.referral_source || '',
  );
  const [pharmacyName, setPharmacyName] = useState<string | null>(
    patient?.pharmacy_name || '',
  );
  const [pharmacyPhone, setPharmacyPhone] = useState<string | null>(
    patient?.pharmacy_phone || '',
  );

  const [submitOkay, setSubmitOkay] = useState<boolean>(true);
  const [warningOpen, setWarningOpen] = useState<boolean>(false);
  const [existingPatients, setExistingPatients] = useState<ExistingPatient[]>(
    [],
  );

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
  };

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
  };

  const handlePhoneChange = (phone: string) => {
    setPhone(phone);
  };

  const handlePharmacyPhoneChange = (pharmacyPhone: string) => {
    setPharmacyPhone(pharmacyPhone);
  };

  const handleAddPatient = async (formData: FormData) => {
    const response = await checkForExistingPatient(formData);

    if (response && response.exists && response.patients) {
      // console.log('existing patients with same name:', response.patients);
      // console.log('open modal!');
      setExistingPatients(response.patients);
      setWarningOpen(true);
    }
  };

  return (
    <form>
      <div className="max-w-prose rounded-md bg-gray-50 p-4">
        <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <input name="id" hidden defaultValue={patient?.id}></input>
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
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Patient Phone Number
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
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="mb-2 block text-sm font-medium">
            Patient Country of Residence
          </label>
          <CountrySelect country={country} setCountry={handleCountryChange} />
        </div>

        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
          {/* City or Town */}
          <div className="">
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

          <div className="">
            <label htmlFor="state" className="mb-2 block text-sm font-medium">
              {country === 'Canada' ? 'Province / Territory' : 'State'}
            </label>
            <div className="relative">
              {country === 'Canada' ? (
                <CanadaProvinceSelect
                  state={state}
                  setState={handleStateChange}
                />
              ) : (
                <StateSelect state={state} setState={handleStateChange} />
              )}
            </div>
          </div>
          <div className="">
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
            htmlFor="referral_source"
            className="mb-2 block text-sm font-medium"
          >
            Referral Source
          </label>
          <div className="relative">
            <input
              id="referral_source"
              name="referral_source"
              type="text"
              placeholder="optional"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              value={referralSource || ''}
              onChange={(e) => setReferralSource(e.target.value)}
            ></input>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
          <div>
            <label
              htmlFor="pharmacy_name"
              className="mb-2 block text-sm font-medium"
            >
              Patient Pharmacy
            </label>
            <div className="relative">
              <input
                id="pharmacy_name"
                name="pharmacy_name"
                type="text"
                placeholder=""
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={pharmacyName || ''}
                onChange={(e) => setPharmacyName(e.target.value)}
              ></input>
            </div>
          </div>

          <div>
            <label
              htmlFor="pharmacy_name"
              className="mb-2 block text-sm font-medium"
            >
              Pharmacy Phone
            </label>
            <div className="relative">
              <PhoneInput
                phone={pharmacyPhone}
                setPhone={handlePharmacyPhoneChange}
              />
            </div>
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

        <div className="mt-6 grid grid-cols-2 justify-end gap-4 sm:grid-cols-3">
          {warningOpen && (
            <div className="col-span-2 flex flex-col sm:col-span-3">
              <div className="text-center">
                {existingPatients.length > 1
                  ? 'Patients already exist with that same name:'
                  : 'A patient already exists with that same name:'}
              </div>
              {existingPatients.map((patient) => (
                <div className="my-2 flex flex-row items-center justify-between">
                  <div className="font-semibold">
                    {patient.first_name} {patient.last_name}
                  </div>
                  <div>{patient.date_of_birth}</div>
                  <EditPatientProfile patient_id={patient.id} />
                </div>
              ))}
            </div>
          )}
          <div className="sm:col-start-2">
            <CancelGoBackButton />
          </div>

          {patient ? (
            <SubmitFormButton formAction={editPatient} active={submitOkay}>
              Update Patient
            </SubmitFormButton>
          ) : (
            <>
              {warningOpen ? (
                <SubmitFormButton
                  key="continue"
                  formAction={addPatient}
                  active={submitOkay}
                >
                  Continue Adding Patient
                </SubmitFormButton>
              ) : (
                <SubmitFormButton
                  key="add"
                  formAction={handleAddPatient}
                  active={submitOkay}
                >
                  Add Patient
                </SubmitFormButton>
              )}
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default PatientForm;
