"use client";
import { useState, useEffect } from "react";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface AIChatProps {
    transcript: string;
  }
  
  const AIChat: React.FC<AIChatProps> = ({ transcript }) => {
    const [theInput, setTheInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([
      {
        role: "assistant",
        content: "Do you have any questions about this appointment?",
      },
    ]);
  
    const systemMessage = [
      {
        role: "system",
        content: `You are a medical advocate. Provide helpful and direct answers to the user's questions taking into account the following transcript of a medical appointment. If the user asks a question about something covered in the transcript, reference the exact portion of the transcript that you used to come up with an answer to their question. /// TRANSCRIPT: ${transcript} ///`,
      },
    ];
  
  useEffect(() => {
        const chatHistoryContainer = document.getElementById('chatHistoryContainer');
        if (chatHistoryContainer) {
          chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        }
      }, [chatHistory]);

      const callGetResponse = async () => {
        setIsLoading(true);
      
        // Update messages with the user's input
        setChatHistory((prevChatHistory) => [...prevChatHistory, { role: "user", content: theInput }]);
        
        // Clear the input field
        setTheInput("");
      
        // Scroll to the bottom after updating the messages
        const chatHistoryContainer = document.getElementById("chatHistoryContainer");
        if (chatHistoryContainer) {
          chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        }
      
        const messages = [...systemMessage, ...chatHistory];
        console.log("messages", messages)

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages}), // CHANGE THIS?
        });
      
        const data = await response.json();
        const { output } = data;
      
        // Update messages with AI's response
        setChatHistory((prevChatHistory) => [...prevChatHistory,  output]);
        setIsLoading(false);
      };

  const Submit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      callGetResponse();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center border rounded-lg h-80 mb-4 bg-white">
        <div 
            className="h-full flex flex-col gap-2 overflow-y-auto py-3 px-3 w-full"
            id="chatHistoryContainer">
          {chatHistory.map((msg) => {
            return (
              <div
                key={msg.content}
                className={`w-max max-w-[30rem] rounded-md px-4 py-3 h-min ${
                  msg.role === "assistant"
                    ? "self-start  bg-gray-100 text-gray-800"
                    : "self-end  bg-gray-500 text-gray-50"
                } `}
              >
                {msg.content}
              </div>
            );
          })}

          {/* {isLoading ? (
            <div className="self-start  bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">
              *fetching reply*
            </div>
          ) : (
            ""
          )} */}
        </div>
        
      </div>
      <div className="relative flex flex-1 flex-shrink-0">
       <label htmlFor="chatinput" className="sr-only">
         chat input
       </label>
       <input
            value={theInput}
            onChange={(event) => setTheInput(event.target.value)}
            onKeyDown={Submit}
        name='chatinput'
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
        placeholder="Ask question about appointment..."
      />
      
      <button
        onClick={callGetResponse}
        className='border w-12 h-12 flex flex-col items-center rounded-lg bg-teal-700 hover:bg-teal-600 active:bg-teal-500 transition-colors ml-2'>
        <PaperAirplaneIcon className="h-[22px] w-[22px]  translate-y-1/2 text-gray-50 " />
      </button>
      
      
    </div>
      
     
    </>
  );
}

export default AIChat


//     <div className='border rounded-lg h-80 bg-white mb-4'>
//         {chatContent}
//     </div>
//     <div className="relative flex flex-1 flex-shrink-0">
//       <label htmlFor="chatinput" className="sr-only">
//         chat input
//       </label>
//       <input
//         name='chatinput'
//         className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
//         placeholder="Ask question about appointment..."
//       />
      
//       <button className='border w-12 h-12 flex flex-col items-center rounded-lg bg-teal-700 hover:bg-teal-600 active:bg-teal-500 transition-colors ml-2'>
//         <PaperAirplaneIcon className="h-[22px] w-[22px] translate-y-1/2 text-gray-50 " />
//       </button>
      
      
//     </div>
//     </>

// 'use client'

// import { useState, useEffect } from 'react';
// import OpenAI from 'openai';

// interface AIChatProps {
//   transcript: string[];
// }

// const AIChat: React.FC<AIChatProps> = ({ transcript }) => {
//   const [userInput, setUserInput] = useState<string>('');
//   const [chatHistory, setChatHistory] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Add your API key here
//   const openai = new OpenAI({apiKey: 'sk-980' })
// //   process.env.OPENAI_API_KEY

//   const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUserInput(e.target.value);
//   };

//   const handleSendMessage = async () => {
//     // Display user input immediately
//     setChatHistory([...chatHistory, `User: ${userInput}`]);

//     // Add logic to send user input to the AI service
//     try {
//       setLoading(true);

//     //   const completion = await openai.chat.completions.create({
//     //     prompt: chatHistory.join('\n') + '\nUser: ' + userInput,
//     //     max_tokens: 150,
//     //   });

//     //   const aiReply = response.choices[0].text.trim();
//     //   setChatHistory([...chatHistory, `AI: ${aiReply}`]);
//       setUserInput('');
//     } catch (error) {
//       console.error('Error communicating with AI service:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Scroll to the bottom of the chat history when it updates
//   useEffect(() => {
//     const chatHistoryContainer = document.getElementById('chatHistoryContainer');
//     if (chatHistoryContainer) {
//       chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
//     }
//   }, [chatHistory]);

//   return (
//     <div>
//       <div id="chatHistoryContainer" style={{ maxHeight: '300px', overflowY: 'auto' }}>
//         {chatHistory.map((message, index) => (
//           <div key={index}>{message}</div>
//         ))}
//         {loading && <div>AI is generating a response...</div>}
//       </div>
//       <div>
//         <input
//           type="text"
//           value={userInput}
//           onChange={handleUserInput}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleSendMessage} disabled={loading}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AIChat;

// import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
// import { useState } from 'react';

// const [chatContent, setChatContent] = useState({})

// export default function AIChat({ transcript }: { transcript: object }) {
  
  
//   return (
//     <>
//     <div className='border rounded-lg h-80 bg-white mb-4'>
//         {chatContent}
//     </div>
//     <div className="relative flex flex-1 flex-shrink-0">
//       <label htmlFor="chatinput" className="sr-only">
//         chat input
//       </label>
//       <input
//         name='chatinput'
//         className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
//         placeholder="Ask question about appointment..."
//       />
      
//       <button className='border w-12 h-12 flex flex-col items-center rounded-lg bg-teal-700 hover:bg-teal-600 active:bg-teal-500 transition-colors ml-2'>
//         <PaperAirplaneIcon className="h-[22px] w-[22px] translate-y-1/2 text-gray-50 " />
//       </button>
      
      
//     </div>
//     </>

//   );
// }