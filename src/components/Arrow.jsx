import { FaArrowRightLong } from "react-icons/fa6";

export default function Arrow({text}){
    return (
        <div className="flex group items-center space-x-4 hover:text-cyan-600/40 cursor-pointer">
        <FaArrowRightLong
         size={25}
        className="transform transition-transform duration-500 group-hover:translate-x-2"
        />
        <h3 className="underline underline-offset-4 text-sm">
        {text}
         </h3>
        </div>
    )
}