
export const JSONschemas = {
    1: {
        "type": "object",
        "properties": {
            "appointment_date": {
                "type": "string",
                "format": "date",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
                "description": "Date of the appointment in yyyy-mm-dd format"
            },
            "appointment_time": {
                "type": "string",
                "pattern": "^\\d{2}:\\d{2}$",
                "description": "Time of the appointment in hh:mm format"
            },
            "chief_complaint": {
                "type": "string",
                "maxLength": 50,
                "description": "Chief complaint. Capitalize the first letter of the string"
            },
            "soap_subjective": {
                "type": "string",
                "description": "SOAP note subjective including any of the following: History of the present illness including onset, palliating/provoking factors, quality, region/radiation, severity/associated symptoms, and time course (OPQRST); pertinent medical, surgical, family, and social history; current medications with doses and frequency. DO NOT include patient name or date of birth."
            },
            "soap_objective": {
                "type": "string",
                "description": "Objective observations and measurements. Narrative format or UNORDERED list. DO NOT include patient name or date of birth."
            },
            "soap_assessment": {
                "type": "string",
                "description": "Assessment and diagnosis. Narrative format or UNORDERED list. NO DIFFERENTIAL DIAGNOSIS in this field."
            },
            "soap_plan": {
                "type": "string",
                "description": "Plan for treatment and patient education. Narrative format or UNORDERED list. Be sure to correct spelling and formatting of medications."
            },
            "patient_instructions": {
                "type": "string",
                "description": "Instructions given to the patient."
            },
            "differential_diagnosis": {
                "type": "string",
                "description": "Differential diagnosis and alternative treatment plan. Narrative format or UNORDERED list. ALWAYS INCLUDE."
            },
            "patient_location": {
                "type": "string",
                "description": "Location of the patient (State/Province, e.g., 'Arizona'). Only include this key if the patient location is clearly mentioned in the transcript."
            }
        }
    }
}

export type JSONSchemaVersion = keyof typeof JSONschemas;