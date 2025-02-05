import React from 'react';
import moment from 'moment';
import { RiDeleteBin5Fill } from 'react-icons/ri';

const Notecard = ({ title, content, date, onClick, onDelete, isSelected}) => {
    return (
        <div className='h-fit' onClick={onClick}>
            <div className={`flex justify-between flex-col w-96 h-36 rounded-3xl p-4 mt-3 ${isSelected? "bg-my-yellow" : "bg-white"}`}>
                <div className='flex flex-row items-center justify-between w-full'>
                    <h1 className={`font-bold ${isSelected? "text-white" : "text-black" }` }>{title}</h1>


                    {/* Delete button that calls onDelete */}
                    <button onClick={(e)=>{e.stopPropagation(); onDelete()}} className="text-red-500 hover:text-red-700">
                        <RiDeleteBin5Fill />
                    </button>
                </div>
                <p className='text-sm/4 opacity-65'>{content?.slice(0, 150)}</p>
                <h3 className='text-sm font-semibold opacity-80'>{moment(date).format('L')}</h3>
            </div>
        </div>
    );
};
export default Notecard;
