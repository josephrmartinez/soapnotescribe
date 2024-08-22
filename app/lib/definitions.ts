import { Database } from "../database.types";

export type Note = Database['public']['Tables']['note']['Row'];

export type Patient = Database['public']['Tables']['patient']['Row'];

export type Template = Database['public']['Tables']['template']['Row'];


export interface PatientForTable {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
}

export type PatientOption = {
  value: Patient;
  label: string;
}

export interface PatientSelect {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_street: string;
  address_unit: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  provider: string;
  date_of_birth: string;
  allergies: string;
  profile_notes: string;
}

export interface PatientSelectOption {
  value: PatientSelect;
  label: string;
}


export interface TemplateOption {
  value: Template | string;
  label: string;
}

export type NoteWithPatient = Omit<Database['public']['Tables']['note']['Row'], 'patient_id'> & {
  patient_id: string;
  patient: Patient;
}

export interface NoteForTable {
  id: string;
  chief_complaint: string;
  status: string;
  appointment_date: string;
  patient: PatientForTable;
}
