"use client";
import { useState, useEffect } from "react";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface AIChatProps {
    transcript: string;
  }
  
  const AIChat: React.FC<AIChatProps> = ({ transcript }) => {
    const [chatInput, setChatInput] = useState("");
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
        setChatHistory((prevChatHistory) => [...prevChatHistory, { role: "user", content: chatInput }]);
        
        // Clear the input field
        setChatInput("");
      
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
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
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