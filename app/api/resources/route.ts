import { NextResponse } from "next/server";
import Exa from 'exa-js';

const exa = new Exa("4ed3c884-65b6-4ecd-bc46-8ec854a15671"); 


interface SearchResult {
    title: string;
    url: string;
    publishedDate: string;
    author: string | null;
    id: string;
    score: number;
  }
  
  interface SearchResponse {
    autopromptString: string;
    results: SearchResult[];
  }


export async function POST(req: Request, res: NextResponse) {
  const body = await req.json();
  console.log("req body:", body);

  try {
      const autoPromptedResults = await exa.search(`${body.text}`, {
        useAutoprompt: true,
        numResults: 5,
        excludeDomains: ["www.amazon.com"] 
      }) as SearchResponse

    
    return NextResponse.json({ output: autoPromptedResults }, { status: 200 });
        
      
    } catch (error) {
      console.error(error);
    }  
}