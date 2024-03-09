'use client'

import { useState, useEffect, FormEvent } from "react";
import { PaperAirplaneIcon, ArrowPathIcon, StopCircleIcon } from "@heroicons/react/24/outline";
import { useChat } from 'ai/react';
import { getContext } from "@/app/lib/data";
import ContextTable from "./context";
import { Appointment } from "@/app/lib/definitions";


interface AIChatProps {
    appointmentHistory: string;
  }

interface Message {
  role: string;
  content: string;
}
  
  const AdvocateChat: React.FC<AIChatProps> = ({ appointmentHistory }) => {
    const [chatInput, setChatInput] = useState("");
    const [context, setContext] = useState<Appointment[]>([])
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
      api: '/api/advocatechat',
      initialMessages: [
        {
          role: "assistant",
          content: "Do you have any questions about something discussed in any of your appointments?",
          id: 'a4s3d2f1'
        },
      ],

    });

    useEffect(() => {
        console.log("calling useEffect")
        const chatHistoryContainer = document.getElementById('chatHistoryContainer');
        if (chatHistoryContainer) {
          chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        }
        
        // getNewContext()

      }, [messages]);
    
      // CANNOT USE ASYNC IN CLIENT COMPONENT?
      const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e);
        const lastMessage = messages[messages.length - 1];
        const newContext = await getContext(lastMessage.content)
        console.log("newContext", newContext)
        setContext(newContext)
      }

      // async function getNewContext(){
      //   // Get the last message
      //   const lastMessage = messages[messages.length - 1];
      //   const newContext = await getContext(lastMessage.content)
      //   console.log("newContext", newContext)
      //   setContext(newContext)
      // }

    return (
      <div className="grid grid-cols-3 gap-8 mt-8">
        
        <div className="mx-auto col-span-2 w-full">
        <div className='mb-4 font-semibold text-gray-700 tracking-wide text-sm text-center'>CHAT</div>

        <div className="flex flex-col items-center border rounded-lg h-96 mb-4 bg-white">
          <div 
              className="h-full flex flex-col gap-2 overflow-y-auto py-3 px-3 w-full"
              id="chatHistoryContainer">
            {messages
              .filter(msg => msg.role !== 'system')
              .map((msg) => {
                return (
                  <div
                    key={msg.id}
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
          </div>
          
        </div>
        <div className="w-full">
          <label htmlFor="chatinput" className="sr-only">
            chat input
          </label>
          <form onSubmit={handleMessageSubmit} className="flex flex-row">
            <input
                value={input}
                onChange={handleInputChange}
                name='chatinput'
                className="w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                placeholder="Ask question about something discussed in any of your appointments..."
            />
            
            {!isLoading ? <button
              type="submit"
              className='border w-12 h-12 flex flex-col items-center rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-500 transition-colors ml-2'>
              <PaperAirplaneIcon className="h-[22px] w-[22px]  translate-y-1/2 text-gray-50 " />
            </button> :
            <button
              type="button"
              onClick={stop}
              className='border w-12 h-12 flex flex-col items-center rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-500 transition-colors ml-2'>
              <StopCircleIcon className="h-[22px] w-[22px]  translate-y-1/2 text-gray-50 " />
            </button>
            }

          </form>
        


        </div>


        </div>

        <div className="col-start-3 flex flex-col">
        
        <div className='mb-4 font-semibold text-gray-700 tracking-wide text-sm text-center'>REFERENCED APPOINTMENTS</div>
        <div className="flex-1 border rounded-lg">
          <ContextTable appointments={context}/>
        </div>
          
        </div>
      </div>
      
    );
  }
  
  export default AdvocateChat