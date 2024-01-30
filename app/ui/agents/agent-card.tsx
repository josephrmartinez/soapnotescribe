'use client'

import React from "react"
import { useState } from "react"
import { ToggleLeft, ToggleRight, } from "@phosphor-icons/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";



export default function AgentCard({ underlineText, normalText }: { underlineText: string, normalText: string }) {

    const [active, setActive] = useState(true)

    function toggleActive(){
        setActive(!active)
    }

    return (
    <div className={`${active ? 'shadow bg-white' : 'border bg-gray-50'} transition-all rounded-lg p-4 my-4 flex flex-row justify-between`}>
        
        
        <div className='text-xl font-medium text-teal-700 max-w-prose'> <span className='underline underline-offset-4'>{underlineText}</span> {normalText}</div>
        
        <div onClick={toggleActive} className="w-48 flex flex-row items-center">
            <div className="mr-2 w-8 text-sm font-semibold text-gray-700">{active ? 'ON' : 'OFF'}</div> 
            {active ? <ToggleLeft size={28} fill="green" weight="duotone"/> : <ToggleRight size={28} fill="gray" weight="light"/>}
            <div className="ml-6 mr-2 text-sm font-semibold text-gray-700">SETTINGS</div>
            <AdjustmentsHorizontalIcon width={28}/>
        </div>

      </div>

    )
}

