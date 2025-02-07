import React from 'react'
import moment from 'moment'
import Tagcard from '../Tagcards/Tagcard';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { TiPinOutline, TiPin } from "react-icons/ti";


const Notecard = ({ title, isPinned, tags, content, date, onClick, onDelete, isSelected }) => {

    return (
        <div className='h-fit' onClick={onClick}>
            <div className={`flex justify-between flex-col w-96 h-48 rounded-3xl p-4 mt-3 ${isSelected ? "bg-my-yellow" : "bg-white"} `}>
                <div className='flex flex-col gap-2'>
                    <h1 className={`flex items-center justify-between font-bold ${isSelected ? "text-white" : "text-black"}`}>{title}<button>{isPinned ? <TiPin className='size-5' /> : ""}
                    </button></h1>
                    <p className={`break-words text-sm /4 ${isSelected ? "text-white" : "text-[#6F6F6F]"}`}>{content?.length > 120 ? content.slice(0, 120) + "..." : content}</p>                </div>


                <div>
                    <Tagcard tags={tags} isSelected={isSelected} />
                </div>

                <div className='flex justify-between items-center'>
                    <h3 className={`text-sm font-semibold ${isSelected ? "text-white" : "text-[#6F6F6F]"}`}>{moment(date).format('L')}</h3>
                    <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="bg-[#E7E7E7] p-2 rounded-lg text-red-500 hover:text-red-700">
                        <RiDeleteBin5Fill />
                    </button>                </div>

            </div>
        </div >
    )
}

export default Notecard