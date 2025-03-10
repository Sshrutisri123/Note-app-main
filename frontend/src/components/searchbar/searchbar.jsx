import React from 'react'
import {SlMagnifier} from 'react-icons/sl'

const searchbar = ({searchQuery, setSearchQuery}) => {
  return (
    <div className="flex items-center h-8 gap-5 px-1 py-1 border bg-white rounded-lg ">
      <SlMagnifier className='size-4' />
      <input className='w-full focus:outline-none text-sm' type='text'  placeholder='Search notes' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
    </div>
  )
}

export default searchbar