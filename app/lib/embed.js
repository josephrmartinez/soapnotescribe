export async function embed(content) {
    try {
      const { pipeline } = await import('@xenova/transformers');
      
      // Your code here
      const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');
  
      // Generate a vector using Transformers.js
      const output = await generateEmbedding(content, {
        pooling: 'mean',
        normalize: true,
      });
  
      // Extract the embedding output
      const embedding = Array.from(output.data);
  
      return embedding;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  