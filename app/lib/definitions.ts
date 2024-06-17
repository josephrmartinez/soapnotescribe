import { Database } from "../database.types";

export type Note = Database['public']['Tables']['note']['Row'];

export type Patient = Database['public']['Tables']['patient']['Row'];

export type NoteWithPatient = Omit<Database['public']['Tables']['note']['Row'], 'patient_id'> & {
  patient_id: string;
  patient: Patient;
}
