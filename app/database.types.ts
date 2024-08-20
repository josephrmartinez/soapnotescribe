export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      note: {
        Row: {
          allergies: string | null
          analysis_cost: number | null
          appointment_date: string | null
          appointment_specialty: string | null
          appointment_summary: string | null
          appointment_time: string
          appointment_type: string | null
          audio_storage_url: string | null
          audio_transcript: string | null
          chief_complaint: string | null
          combined_text: string | null
          consent: boolean | null
          created_at: string
          differential_diagnosis: string | null
          discharge_instructions: string | null
          doctor_signature: string | null
          feedback: string | null
          id: string
          image_urls: string[] | null
          patient_age_years: number | null
          patient_id: string | null
          patient_location: string | null
          pdf_storage_url: string | null
          soap_assessment: string | null
          soap_objective: string | null
          soap_plan: string | null
          soap_subjective: string | null
          status: string | null
          temp_audio_url: string | null
          transcription_cost: number | null
          transcription_time: string | null
          user_id: string
        }
        Insert: {
          allergies?: string | null
          analysis_cost?: number | null
          appointment_date?: string | null
          appointment_specialty?: string | null
          appointment_summary?: string | null
          appointment_time?: string
          appointment_type?: string | null
          audio_storage_url?: string | null
          audio_transcript?: string | null
          chief_complaint?: string | null
          combined_text?: string | null
          consent?: boolean | null
          created_at?: string
          differential_diagnosis?: string | null
          discharge_instructions?: string | null
          doctor_signature?: string | null
          feedback?: string | null
          id?: string
          image_urls?: string[] | null
          patient_age_years?: number | null
          patient_id?: string | null
          patient_location?: string | null
          pdf_storage_url?: string | null
          soap_assessment?: string | null
          soap_objective?: string | null
          soap_plan?: string | null
          soap_subjective?: string | null
          status?: string | null
          temp_audio_url?: string | null
          transcription_cost?: number | null
          transcription_time?: string | null
          user_id?: string
        }
        Update: {
          allergies?: string | null
          analysis_cost?: number | null
          appointment_date?: string | null
          appointment_specialty?: string | null
          appointment_summary?: string | null
          appointment_time?: string
          appointment_type?: string | null
          audio_storage_url?: string | null
          audio_transcript?: string | null
          chief_complaint?: string | null
          combined_text?: string | null
          consent?: boolean | null
          created_at?: string
          differential_diagnosis?: string | null
          discharge_instructions?: string | null
          doctor_signature?: string | null
          feedback?: string | null
          id?: string
          image_urls?: string[] | null
          patient_age_years?: number | null
          patient_id?: string | null
          patient_location?: string | null
          pdf_storage_url?: string | null
          soap_assessment?: string | null
          soap_objective?: string | null
          soap_plan?: string | null
          soap_subjective?: string | null
          status?: string | null
          temp_audio_url?: string | null
          transcription_cost?: number | null
          transcription_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_appointments_provider_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient: {
        Row: {
          address_street: string | null
          address_unit: string | null
          allergies: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          middle_name: string | null
          pharmacy_name: string | null
          pharmacy_phone: string | null
          phone: string | null
          profile_notes: string | null
          provider: string | null
          referral_source: string | null
          sex: string | null
          state: string | null
          zipcode: string | null
        }
        Insert: {
          address_street?: string | null
          address_unit?: string | null
          allergies?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          pharmacy_name?: string | null
          pharmacy_phone?: string | null
          phone?: string | null
          profile_notes?: string | null
          provider?: string | null
          referral_source?: string | null
          sex?: string | null
          state?: string | null
          zipcode?: string | null
        }
        Update: {
          address_street?: string | null
          address_unit?: string | null
          allergies?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          pharmacy_name?: string | null
          pharmacy_phone?: string | null
          phone?: string | null
          profile_notes?: string | null
          provider?: string | null
          referral_source?: string | null
          sex?: string | null
          state?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      template: {
        Row: {
          chief_complaint: string | null
          id: string
          soap_assessment: string | null
          soap_objective: string | null
          soap_plan: string | null
          soap_subjective: string | null
          user_id: string | null
        }
        Insert: {
          chief_complaint?: string | null
          id?: string
          soap_assessment?: string | null
          soap_objective?: string | null
          soap_plan?: string | null
          soap_subjective?: string | null
          user_id?: string | null
        }
        Update: {
          chief_complaint?: string | null
          id?: string
          soap_assessment?: string | null
          soap_objective?: string | null
          soap_plan?: string | null
          soap_subjective?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          appointment_specialties: string[] | null
          appointment_specialties_default: string | null
          appointment_types: string[] | null
          appointment_types_default: string | null
          user_id: string
        }
        Insert: {
          appointment_specialties?: string[] | null
          appointment_specialties_default?: string | null
          appointment_types?: string[] | null
          appointment_types_default?: string | null
          user_id: string
        }
        Update: {
          appointment_specialties?: string[] | null
          appointment_specialties_default?: string | null
          appointment_types?: string[] | null
          appointment_types_default?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string | null
          id: number
          note: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          note?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          note?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_note_audio: {
        Args: {
          user_id: string
          audio_storage_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_note_pdf: {
        Args: {
          user_id: string
          pdf_storage_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      get_notes_by_query: {
        Args: {
          query: string
        }
        Returns: {
          allergies: string | null
          analysis_cost: number | null
          appointment_date: string | null
          appointment_specialty: string | null
          appointment_summary: string | null
          appointment_time: string
          appointment_type: string | null
          audio_storage_url: string | null
          audio_transcript: string | null
          chief_complaint: string | null
          combined_text: string | null
          consent: boolean | null
          created_at: string
          differential_diagnosis: string | null
          discharge_instructions: string | null
          doctor_signature: string | null
          feedback: string | null
          id: string
          image_urls: string[] | null
          patient_age_years: number | null
          patient_id: string | null
          patient_location: string | null
          pdf_storage_url: string | null
          soap_assessment: string | null
          soap_objective: string | null
          soap_plan: string | null
          soap_subjective: string | null
          status: string | null
          temp_audio_url: string | null
          transcription_cost: number | null
          transcription_time: string | null
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
