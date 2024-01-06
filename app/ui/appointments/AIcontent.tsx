'use client'

import React, { useState } from 'react';

const transcriptContent = (
    <div>
    "transcript"
    </div>)    
const feedbackContent = (<div>
    "feedback"
    </div>)
const summaryContent = (
    <>
        
        <p>During the appointment, the doctor aimed to understand the couple's fertility concerns and performed an early evaluation including an ultrasound. The physician had previously observed a tilted uterus during an HSG (Hysterosalpingogram) which was concerning, prompting further investigation to identify a possible cause such as scarring or a mass effect.</p>
    <br></br>
    <p>The couple had already attempted to conceive for nearly a year with no pregnancy, triggering the concern that there might be an underlying issue. The conversation also covered the potential adverse effects of a ruptured appendix on fertility, with the doctor mentioning that, based on personal experience and anecdotes from a colleague, patients who have had a true ruptured appendix seldom conceive naturally. This prompted the doctor to consider that IVF might be the preferred route for conception in such cases, regardless of whether the fallopian tubes appear to be open, because of potential scar-related issues.
    </p>
    <br></br>
    <p>Further steps recommended by the doctor included a semen analysis for the male partner, and for the female partner, an ultrasound on day 17 of her cycle to check for signs of ovulation, and a follow-up with additional fertility testing.
    </p>
    <br></br>
    <p className="text-lg font-semibold">Key takeaways from this appointment:</p>
    <li>The doctor suspects there might be an issue due to the woman's history of ruptured appendix and the couple's year-long unsuccessful attempt at natural conception.
    </li>
    <li>The doctor advises that, based on past experiences, IVF may be a more appropriate treatment given the potential for scarring from a ruptured appendix.
    </li>
    <li>Further testing, including semen analysis and additional ultrasounds, is necessary to determine the best course of action.</li>
    
    </>
    )

const AIContent = () => {
    const [activeTab, setActiveTab] = useState('transcript');
      
      const handleTabClick = (tab) => {
        setActiveTab(tab);
      };
      
      const ContentRenderer = ({ content }) => {
          return <div>{content}</div>;
        };

        return (
            <>
            
            <div className="grid grid-cols-5 mb-4">
            
            <button className={`text-lg font-semibold text-gray-500 mt-2 ${activeTab === 'transcript' && 'text-gray-700 underline underline-offset-4'}`}
                onClick={() => handleTabClick('transcript')}>Transcript</button>
            <button className={`text-lg font-semibold text-gray-500 mt-2 ${activeTab === 'summary' && 'text-gray-700 underline underline-offset-4'}`}
                onClick={() => handleTabClick('summary')}>Summary</button>
            <button className={`text-lg font-semibold text-gray-500 mt-2 ${activeTab === 'feedback' && 'text-gray-700 underline underline-offset-4'}`}
                onClick={() => handleTabClick('feedback')}>Feedback</button>
            
            </div>

            <div className="h-48 overflow-y-scroll border p-2 border-gray-100 rounded-lg">
            {activeTab === 'transcript' && <ContentRenderer content={transcriptContent}/>}
            {activeTab === 'summary' && <ContentRenderer content={summaryContent}/>}
            {activeTab === 'feedback' && <ContentRenderer content={feedbackContent}/>}
            </div>
            </>
        )
}

export default AIContent