import React, { useState } from 'react'
import logo from '../../assets/logo/logo1.jpg'
import profile from '../../assets/logo/profile/Profile.jpeg'
import { signOutFailure, signOutStart, signOutSuccess } from '../../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiLogOut, FiSettings, FiLock, FiStar, FiBookOpen, FiBookmark, FiTrash2 } from "react-icons/fi";




const Sidebar = ({ userInfo, getAllNotes, getPinnedNotes }) => {


    const [activeTab, setActiveTab] = useState("all")
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const dispatch = useDispatch()
    const navigate = useNavigate()



    const onLogOut = async () => {
        try {
            dispatch(signOutStart())

            const res = await axios.get("http://localhost:3000/api/auth/signout", { withCredentials: true })

            if (res.data.success === false) {
                dispatch(signOutFailure(res.data.message))
            }

            dispatch(signOutSuccess())
            navigate('/Login')

        } catch (error) {
            dispatch(signOutFailure(error.message))
        }
    }

    return (
        <aside className="h-full bg-zinc-100 w-14 flex flex-col p-2 border-r border-gray-300 justify-between">

            <div className='space-y-8'>
                {/* side bar logo */}
                <div className="flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-8 rounded-lg" />
                </div>


                <div className="flex flex-col gap-0">
                    <button
                        className="relative flex items-center justify-center px-2 py-2 rounded-lg bg-transparent text-[#575656] hover:bg-gray-200 transition-all group"
                        onClick={() => {
                            setActiveTab("all");
                            getAllNotes();
                        }}>
                        <FiBookOpen className='size-4' />
                        {/* Tooltip */}
                        <span className="absolute left-full ml-2 px-2 py-1 text-xs font-light text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            All Notes
                        </span>
                    </button>

                    <button className="relative flex items-center justify-center  px-2 py-2  rounded-lg bg-transparent text-[#575656] hover:bg-gray-200 transition-all group"
                        onClick={() => {
                            setActiveTab("Pinned");
                            getPinnedNotes();
                        }}
                    ><FiBookmark className='size-4' />
                    {/* Tooltip */}
                    <span className="absolute left-full ml-2 px-2 py-1 text-xs font-light text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Pinned Notes
                        </span>
                        </button>

                    <button className=' relative flex items-center justify-center gap-5 w-full px-2 py-2 font-semibold text-sm text-[#575656] bg-transparent hover:bg-gray-200 rounded-lg transition-all group'><FiTrash2 className='size-4' />
                    {/* Tooltip */}
                    <span className="absolute left-full ml-2 px-2 py-1 text-xs font-light text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Deleted Notes
                        </span>
                    </button>

                </div>

            </div>





            {/* user icon */}
            <div className="relative">
                <div
                    className="flex items-center gap-3  rounded-md cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img src={profile} alt="profile" className="w-14 h-8 rounded-md object-cover" />
                </div>

                {dropdownOpen && (
                    <div className="absolute left-6 bottom-8 w-52 bg-white shadow-lg rounded-xl p-1 border border-gray-200 z-50">

                        <div className='flex justify-start p-2 items-center gap-2 mb-1 '>
                            <img src={profile} alt="profile" className="w-10 h-9 rounded-md object-cover" />
                            <div className='flex flex-col'>
                                <span className="font-medium text-gray-700">{userInfo?.username}</span>
                                <span className="font-normal text-xs -mt-1 text-gray-950">a@gamil.com</span>
                            </div>
                        </div>

                        <hr className='border-gray-100 my-1' />

                        <div className='flex flex-col gap-0'>

                            <button className='flex items-center gap-3 w-full px-2 py-2 text-sm font-normal text-gray-950 bg-transparent hover:bg-gray-100 rounded-md transition-all '><FiSettings className='size-4' />Settings</button>

                            <button className='flex items-center gap-3 w-full px-2 py-2 text-sm font-normal text-gray-950 bg-transparent hover:bg-gray-100 rounded-md transition-all '><FiLock className='size-4' />Privacy</button>

                            <button className='flex items-center gap-3 w-full px-2 py-2 text-sm font-normal text-gray-950 bg-transparent hover:bg-gray-100 rounded-md transition-all'><FiStar className='size-4' />What's New</button>
                        </div>

                        <hr className='border-gray-100 my-1' />

                        <button
                            className="flex items-center gap-3 w-full px-2 py-2 text-sm font-normal rounded-md text-gray-950 hover:bg-gray-100 transition"
                            onClick={onLogOut}
                        >
                            <FiLogOut className='size-4' />
                            Log out
                        </button>
                    </div>
                )}
            </div>

        </aside>
    )
}

export default Sidebar