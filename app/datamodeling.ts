// type Allergy = "NKDA" | "PCN" | "SULFA" | "Other";

// interface Appointment {
//     id: string
//     provider_id?: string;
//     audio_storage_url?: string;
//     temp_audio_url?: string;
//     image_urls?: string[];
//     audio_transcript?: JSON;
//     patient_name: string;
//     patient_date_of_birth: string;
//     date_seen: string;
//     time_seen: string;
//     allergies: Allergy | { type: "Other"; description: string };
//     chief_complaint?: string;
//     soap_subjective?: string;
//     soap_objective?: string;
//     soap_assessment?: string;
//     soap_plan?: string;
//     patient_location?: string;
//     appointment_summary?: string;
//     discharge_instructions?: string;
//     combined_text?: string;
//     feedback?: string;
//     second_opinion?: string;
//   }


//   CREATE TABLE 
//   public.appointments (
//     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     created_at timestamp with time zone not null default now(),
//     provider_id UUID default auth.uid(),
//     audio_storage_url TEXT,
//     temp_audio_url TEXT,
//     image_urls TEXT[],
//     audio_transcript JSONB,
//     patient_name TEXT,
//     patient_date_of_birth DATE,
//     date_seen DATE,
//     time_seen TIME,
//     allergy_type TEXT,
//     allergy_description TEXT,
//     chief_complaint TEXT,
//     soap_subjective TEXT,
//     soap_objective TEXT,
//     soap_assessment TEXT,
//     soap_plan TEXT,
//     patient_location TEXT,
//     appointment_summary TEXT,
//     discharge_instructions TEXT,
//     combined_text TEXT,
//     feedback TEXT,
//     second_opinion TEXT,
//     CONSTRAINT valid_allergy_type CHECK (allergy_type IN ('NKDA', 'PCN', 'SULFA', 'Other')),
// );