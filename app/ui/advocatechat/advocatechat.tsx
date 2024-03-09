'use client'

import { useState, useEffect, FormEvent } from "react";
import { PaperAirplaneIcon, ArrowPathIcon, StopCircleIcon } from "@heroicons/react/24/outline";
import { useChat } from 'ai/react';
import { getContext } from "@/app/lib/data";
import ContextTable from "./context";
import { Appointment, Context } from "@/app/lib/definitions";


interface AIChatProps {
    appointmentHistory: string;
  }

interface Message {
  role: string;
  content: string;
}
  
  const AdvocateChat: React.FC<AIChatProps> = ({ appointmentHistory }) => {
    const [chatInput, setChatInput] = useState("");
    const [context, setContext] = useState<Context[]>([])

    // const context = [{"id":"bc35f1d9-01c4-4d67-8ef3-4f3b92257886","patient":"a9b982cf-9a41-41f3-8081-793b49f15de3","date":"2024-01-15","clinic":"SCNM","provider":"Dr. Salisbury","title":"LDL lab review","summary":"During the medical appointment, the healthcare provider went over the patient's recent lab results, specifically focusing on the lipid panel. The provider noted that overall the results looked good, except for the LDL cholesterol, which was measured at 120, above the reference range of 0 to 99. The provider emphasized that the patient's LDL levels had improved from a previous measurement of around 160. The patient expressed confusion and concern about the significance of the LDL number and its potential impact on their health. The provider acknowledged the patient's perspective and explained that while there are general reference ranges for LDL, individual variations and health considerations come into play. The patient likened the situation to someone driving at an improved but still unacceptable speed in a school zone, emphasizing the difficulty in interpreting the significance of the LDL number. The provider reassured the patient that the improvement in LDL levels was a positive outcome and appreciated the effort the patient had put into making this improvement. The conversation ended with the patient and provider discussing the complexities of interpreting LDL numbers and recognizing the improvement achieved.","similarity":0.404133814450092},{"id":"a4235050-7a19-4ac3-83ab-989ff041f4ee","patient":"a9b982cf-9a41-41f3-8081-793b49f15de3","date":"2024-02-10","clinic":"SCNM","provider":"Dr. Salisbury","title":"Bloodwork lab review","summary":"The medical appointment transcript involves a discussion between a medical professional and a patient about the results of some testing related to fertility. The medical professional reassures the patient that nothing came back as shocking, despite a few things that need to be discussed. They specifically mention the absence of any major surprises in the test results. The medical professional then goes on to explain a procedure called HSG (Hysterosalpingography) to the patient, showing the visualization of the uterus and fallopian tubes to ensure they are not blocked. They describe the procedure and its results, indicating that overall everything looked fine, with some minor observations. The medical professional also mentions a conversation with someone named Charles Coddington about the patient's history of a ruptured appendix and its potential impact on fertility, raising the question of whether certain anatomical abnormalities could be affecting fertility.","similarity":0.385017773207825},{"id":"1e2d0eca-1657-40bf-ab28-a4b999b3ddd0","patient":"a9b982cf-9a41-41f3-8081-793b49f15de3","date":"2024-01-18","clinic":"AMC","provider":"Dr. Abbas","title":"Andrology lab review","summary":"The medical appointment discussed the results of a semen analysis, focusing on various parameters such as sperm concentration, total sperm count, motility, progressive motility, pH levels, and sperm morphology. The physician highlighted that the concentration, total count, and motility of the sperm were within normal ranges, with the total count being particularly robust at 55.8 million. However, the morphology of the sperm, specifically the percentage of normal-shaped sperm, was found to be lower than the ideal range, at only one percent. The physician then provided a helpful analogy to explain the significance of this finding, emphasizing that while the percentage may seem concerning, the absolute number of normal-shaped sperm within the larger population is still substantial. Additionally, the physician clarified that this lower percentage does not necessarily indicate infertility but rather falls under the diagnosis of teratozoospermia, indicating a lower percentage of normal-shaped sperm. The appointment concluded with a discussion about the implications of these findings for potential IVF procedures, noting that while the sperm quality is generally normal for natural conception, IVF may require additional intervention due to the lower percentage of normal-shaped sperm.","similarity":0.375934302806857}]


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
    
    
      const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e);
        // const lastMessage = input;
        // console.log("msg sent for context:", lastMessage )
        // const newContext = await getContext(lastMessage)

        const userMessages = messages.filter(message => message.role === 'user')
        const userMessageString = userMessages.map(message => message.content).join('\n').concat(' ', input);

        console.log("msg sent for context:", userMessageString )
        const newContext = await getContext(userMessageString)
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
        <div className='mb-4 text-gray-600 font-semibold tracking-wide text-sm text-center'>CHAT</div>

        <div className="flex flex-col items-center border rounded-lg h-[24rem] mb-4 bg-white">
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
        
        <div className='mb-4 text-gray-600 font-semibold tracking-wide text-sm text-center'>REFERENCE</div>
        <div className="flex-1 border bg-gray-100 rounded-lg overflow-y-auto">
          <ContextTable appointments={context}/>
        </div>
          
        </div>
      </div>
      
    );
  }
  
  export default AdvocateChat