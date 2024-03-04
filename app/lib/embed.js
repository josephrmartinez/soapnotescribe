'use server'

import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY })

export async function embed(content) {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: appointment.combined_text,
        encoding_format: "float",
        dimensions: 512,
    });
  
      return response.data[0].embedding;
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  