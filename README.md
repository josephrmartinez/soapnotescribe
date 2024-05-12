## soapnotescribe

[soapnotescribe](https://soapnotescribe.com/) automatically generates structured SOAP notes from telehealth appointment recordings or clinical audio memos.

A SOAP note is a structured method for healthcare professionals to document patient care. SOAP is an acronym for a systematic approach to documenting patient encounters:

**Subjective:** Patient's own words about symptoms and concerns.  
**Objective:** Measurable data from exams and tests.  
**Assessment:** Healthcare provider's diagnosis or analysis.  
**Plan:** Treatment and follow-up recommendations.

Healthcare providers complete a SOAP note for each patient encounter. By automatically generating a draft note immediately after each encounter, soapscribe reduces administrative burden and improves accuracy and consistency of clinical documentation.

### GIF demo:

![soapnotescribe gif illustration](public/soapscribedemo.gif)

[soapnotescribe](https://soapnotescribe.com/) saves healthcare providers' time by drafting structured SOAP notes. Providers upload a recording of the entire appointment or an audio memo with clinical notes - soapscribe automatically drafts a structured clinical note for easy review and approval. Soapscribe also automatically provides a second opinion for the clinician, enhancing diagnostic accuracy and treatment planning. This not only streamlines the documentation process but also promotes better patient care by ensuring thorough and consistent note-taking. With soapscribe, healthcare professionals can focus more on patient interaction and less on paperwork, leading to improved efficiency and patient satisfaction.

![soapnotescribe homepage image](public/soapscribescreenlightgray.webp)

## Tech stack:

**Frontend:**
Next.js, React, Tailwind, Typescript

**Backend:**
Supabase (auth, storage, vectordb), Vercel (serverless functions)

**Deployment:**
Vercel

**AI models:**
Replicate, OpenAI
