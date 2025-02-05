import React from 'react'
import {SlMagnifier} from 'react-icons/sl'

const searchbar = () => {
  return (
    <div className='flex border shadow-inner items-center  h-9 gap-5 -mt-2 p-2  bg-white rounded-lg  '>
      <SlMagnifier className='size-4' />
      <input className='w-full focus:outline-none' type='text' placeholder='Search notes' />
    </div>
  )
}

export default searchbar