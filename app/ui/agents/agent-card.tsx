'use client'

import React from "react"
import { useState } from "react"
import { ToggleLeft, ToggleRight, SlidersHorizontal } from "@phosphor-icons/react";



export default function AgentCard({ underlineText, normalText }: { underlineText: string, normalText: string }) {

    const [active, setActive] = useState(true)

    function toggleActive(){
        setActive(!active)
    }

    return (
    <div className={`${active ? 'shadow bg-white' : 'border bg-gray-50'} transition-all h-28 lg:h-16 rounded-lg  my-4 flex flex-row items-center justify-between p-4`}>
        
        
        <div className='text-md font-medium text-teal-700 pr-6'> <span className='underline underline-offset-4'>{underlineText}</span> {normalText}</div>
        
        <div className="w-48 flex flex-row items-center">
            <div className="flex flex-row items-center" onClick={toggleActive}>
                <div className="mr-2 w-8 text-sm font-semibold text-gray-700 select-none">{active ? 'ON' : 'OFF'}</div>
                <div className="cursor-pointer">
                    {active ? <ToggleLeft size={26} fill="green" weight="duotone"/> : <ToggleRight size={26} fill="gray" weight="light"/>}
                </div> 
                
            </div>
            
            <div className="flex flex-row items-center">
                <div className="ml-6 mr-2 text-sm font-semibold text-gray-700 select-none">SETTINGS</div>
                <div className="cursor-pointer">
                    {active? <SlidersHorizontal size={26} fill="green"/> : <SlidersHorizontal size={26} fill="gray" weight="light"/>}
                </div>
                
            </div>
            
        </div>

      </div>

    )
}

