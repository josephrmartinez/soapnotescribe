'use server'

import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY })

export async function embed(content) {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: content,
        encoding_format: "float",
      });
  
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  