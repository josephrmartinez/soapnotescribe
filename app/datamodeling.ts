type appointment = {
    chief_complaint: string | null
    date_seen: string | undefined
    time_seen: string
    audio_url: string | null
    clinic: string | null
    combined_text: string | null
    description: string | null
    feedback: string | null
    id: string
    patient_name: string | null
    provider_name: string | null
    appointment_summary: string | null
    discharge_instructions: string | null
    soap_note: string | null
    temp_audio_url: string | null
    
    transcript: Json
    appts_search: string | null
  }