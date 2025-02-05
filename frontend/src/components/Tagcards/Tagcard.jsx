import React from 'react'

const Tagcard = ({isSelected}) => {
  return (
    <div className={` w-fit px-2 rounded-md ${isSelected ? "bg-white text-black" : "bg-[#6C6B6B] text-white" }`}>#Work</div>
  )
}

export default Tagcard