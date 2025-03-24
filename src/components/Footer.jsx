import { PiDiscordLogoThin } from "react-icons/pi";
import { RiTwitterXLine } from "react-icons/ri";
import { PiInstagramLogoThin } from "react-icons/pi";
import Link from "next/link";

export default function Footer(){

    const fullYear = (new Date().getFullYear())
    return (
        <footer className="mt-auto">
            <div className="flex items-center justify-between">
            <div className="justify-start text-sm font-light py-8">
                <p className="py-2">&copy; Concept.pro, All rights reserved {fullYear}</p>
                <ul className="flex justify-start text-xs space-x-2">
                <li><Link href={'/about'}>About us</Link></li>
                <span>|</span>
                <li><Link href={'/'}>Posts</Link></li>
                <span>|</span>
                <li>Search</li>
                <span>|</span>
                <li>Projects</li>
                
                </ul>
            </div>
            <div className="py-8">
                <div className="flex space-x-4 py-2 text-end justify-end">
                    <PiDiscordLogoThin size={20}/>
                    
                    <RiTwitterXLine size={20}/>
                    
                    <PiInstagramLogoThin size={20}/>
                </div>
                <div className="text-xs font-light uppercase tracking-wide">
                <p>Verify information online</p>
                </div>
            </div>
            </div>
        </footer>
    )
}