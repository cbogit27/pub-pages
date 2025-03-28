"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { PiDiscordLogoThin, PiInstagramLogoThin } from "react-icons/pi";
import { RiTwitterXLine } from "react-icons/ri";
import Arrow from "@/components/Arrow";

export default function AboutPage(){
    return (
        <div className="flex flex-col md:flex-row h-full md:h-screen ">
            <div className="md:w-72 flex-auto bg-transparent text-gray-300 py-8">
                <div>
                        <Link href={"/"} className="text-md cursor-pointer">
                          Six O'Clock
                        </Link>
                        <span className="text-xs font-light hidden md:flex">
                          - before your morning cup
                        </span>
                    </div>

                    <div className="mt-8">
                        <h6 className="text-xl font-semibold">Concept.pro</h6>
                        <p className="text-lg font-medium mt-8 mr-8">Research based analytica and curation, dedicated to business and technology insights,  sourced and refined for our readers</p>
                        <ul className="list-disc space-y-3 mt-8 text-sm font-normal p-4">
                            <li>Reviews and consumer engagement projects.</li>
                            <li>Formal and updated regularly</li>
                            <li>Information to start your day with</li>
                            <li>We are social too</li>
                        </ul>
                    </div>

                    <div className="flex mt-12 space-x-10">
                        <div 
                        
                            className="cursor-pointer">
                            <PiDiscordLogoThin size={30} className="hover:text-gray-200/40 "/>
                        </div>

                        <div
                
                            className="cursor-pointer">
                            <PiInstagramLogoThin size={30} className="hover:text-gray-200/40 "/>
                        </div>

                        <div
            
                            className="cursor-pointer">
                            <RiTwitterXLine size={30} className="hover:text-gray-200/40 "/>
                        </div>
                    </div>

                    <div className="mt-12">
                        <p className="text-xs font-semibold">research and analytics, through qualitatve and quantitative data mining and collation methods.</p>
                    </div>
            </div>


            <div className="md:w-28 flex-auto bg-slate-800/40 text-gray-200 py-8 px-2 md:px-8">
            <div className=" space-y-8">
            <div className="justify-start text-start p-2">
            <h3 className="text-xl font-semibold uppercase tracking-wide">Subscribe</h3>
            
            </div> 
            <div className="justify-start text-start p-2">
                <form className="space-y-4">
                <input className="p-4 text-gray-600 bg-transparent border border-gray-200/20 rounded-full  w-full" placeholder="Enter email"/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                    
                <input className="p-4 text-gray-600 bg-transparent border border-gray-200/20 rounded-full w-full" placeholder="first name"/>
                <input className="p-4 text-gray-600 bg-transparent border border-gray-200/20 rounded-full w-full " placeholder="last name"/>
                </div>
                <button className="bg-gray-400 text-cyan-800 px-4 py-2 rounded-full">submit</button>
                </form>
            </div>
            <div className="text-end justify-end p-2">
                <h3 className="text-lg md:text-2xl font-bold uppercase tracking-widest ml-8">dynamic insights on Business & technology Industries</h3>
            </div>
            <div className="text-end justify-end space-y-2 p-2">
                <h6 className="text-xs font-bold">For consults, reach us here</h6>
                <p className="text-xs font-light">+234816XXXXXX</p>
                <p className="text-xs font-light">test@winbeyondcrude.pro</p>
                <Link href={'/'} className="mt-4 text-xs">
                <Arrow text={"return home"}/>
            </Link>
            </div>
            
            </div>
            </div>
  
    </div>
    )
}

