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
      appointments: {
        Row: {
          allergies: string | null
          appointment_date: string | null
          appointment_summary: string | null
          appointment_time: string | null
          audio_storage_url: string | null
          audio_transcript: string | null
          chief_complaint: string | null
          combined_text: string | null
          consent: boolean | null
          created_at: string
          discharge_instructions: string | null
          doctor_signature: string | null
          feedback: string | null
          id: string
          image_urls: string[] | null
          patient_date_of_birth: string | null
          patient_location: string | null
          patient_name: string | null
          second_opinion: string | null
          soap_assessment: string | null
          soap_objective: string | null
          soap_plan: string | null
          soap_subjective: string | null
          status: string | null
          temp_audio_url: string | null
          user_id: string
        }
        Insert: {
          allergies?: string | null
          appointment_date?: string | null
          appointment_summary?: string | null
          appointment_time?: string | null
          audio_storage_url?: string | null
          audio_transcript?: string | null
          chief_complaint?: string | null
          combined_text?: string | null
          consent?: boolean | null
          created_at?: string
          discharge_instructions?: string | null
          doctor_signature?: string | null
          feedback?: string | null
          id?: string
          image_urls?: string[] | null
          patient_date_of_birth?: string | null
          patient_location?: string | null
          patient_name?: string | null
          second_opinion?: string | null
          soap_assessment?: string | null
          soap_objective?: string | null
          soap_plan?: string | null
          soap_subjective?: string | null
          status?: string | null
          temp_audio_url?: string | null
          user_id: string
        }
        Update: {
          allergies?: string | null
          appointment_date?: string | null
          appointment_summary?: string | null
          appointment_time?: string | null
          audio_storage_url?: string | null
          audio_transcript?: string | null
          chief_complaint?: string | null
          combined_text?: string | null
          consent?: boolean | null
          created_at?: string
          discharge_instructions?: string | null
          doctor_signature?: string | null
          feedback?: string | null
          id?: string
          image_urls?: string[] | null
          patient_date_of_birth?: string | null
          patient_location?: string | null
          patient_name?: string | null
          second_opinion?: string | null
          soap_assessment?: string | null
          soap_objective?: string | null
          soap_plan?: string | null
          soap_subjective?: string | null
          status?: string | null
          temp_audio_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_appointments_provider_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
