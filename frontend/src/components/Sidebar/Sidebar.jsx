import React, { useState } from 'react'
import logo from '../../assets/logo/logo1.jpg'
import profile from '../../assets/logo/profile/Profile.jpeg'
import { signOutFailure, signOutStart, signOutSuccess } from '../../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiLogOut, FiSettings, FiLock, FiStar, FiBookOpen, FiBookmark, FiTrash2 } from "react-icons/fi";
import { IoStarOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Sidebar = ({ userInfo, getTrashNotes, getAllNotes, getPinnedNotes, setActiveTab }) => {


    const [dropdownOpen, setDropdownOpen] = useState(false);


    const dispatch = useDispatch()
    const navigate = useNavigate()



    const onLogOut = async () => {
        try {
            dispatch(signOutStart());
            const token = sessionStorage.getItem("authToken");

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.data.success === false) {
                dispatch(signOutFailure(res.data.message));
                return;
            }

            dispatch(signOutSuccess());
            sessionStorage.removeItem("authToken");

            // Show toast notification
            toast.success("Logged out successfully 🚀", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            // Delay navigation to allow toast to be visible
            setTimeout(() => {
                navigate('/Login');
            }, 1000);

        } catch (error) {
            dispatch(signOutFailure(error.message));
            toast.error("Logout failed ❌", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <aside className="h-full bg-zinc-100 sm:w-14 w-full flex flex-col p-2 border-r border-gray-300 justify-between">

            <div className='space-y-8'>
                {/* side bar logo */}
                <div className="flex items-center sm:justify-center">
                    <img src={logo} alt="Logo" className="w-8 h-auto rounded-lg" />
                    <h1 className='pl-1 sm:hidden block'>otify</h1>
                </div>


                <div className="flex flex-col gap-0">
                    <button className='relative group flex items-center sm:justify-center gap-5 w-full px-2 py-2 font-semibold text-sm text-[#575656] bg-transparent hover:bg-gray-200 rounded-lg transition-all'
                        onClick={() => {
                            setActiveTab("all");
                            getAllNotes();
                        }}>
                        <div className='absolute left-full top-1/2 ml-2 w-20 text-sm font-normal bg-gray-950 border text-gray-50 p-1 rounded-lg shadow-lg opacity-0 translate-x-2 sm:group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 -translate-y-1/2 pointer-events-none hidden sm:block' >All Notes</div>
                        <FiBookOpen className='size-4' />
                        <p className='sm:hidden block'>All Notes</p>
                    </button>

                    <button className='relative group flex items-center sm:justify-center gap-5 w-full px-2 py-2 font-semibold text-sm text-[#575656] bg-transparent hover:bg-gray-200 rounded-lg transition-all'
                        onClick={() => {
                            setActiveTab("pinned");
                            getPinnedNotes();
                        }}>
                        <div className='absolute left-full top-1/2 ml-2 w-20 text-sm font-normal bg-gray-950 border text-gray-50 p-1 rounded-lg shadow-lg opacity-0 translate-x-2 sm:group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 -translate-y-1/2 pointer-events-none' >Stared Notes</div>
                        <IoStarOutline className='size-4' />
                        <p className='sm:hidden block'>Stared Notes</p>
                    </button>

                    <button className='relative group flex items-center sm:justify-center gap-5 w-full px-2 py-2 font-semibold text-sm text-[#575656] bg-transparent hover:bg-gray-200 rounded-lg transition-all'
                        onClick={() => {
                            setActiveTab("trash");
                            getTrashNotes();
                        }}>
                        <div className='absolute left-full top-1/2 ml-2 w-20 text-sm font-normal bg-gray-950 border text-gray-50 p-1 rounded-lg shadow-lg opacity-0 translate-x-2 sm:group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 -translate-y-1/2 pointer-events-none' >Trash</div>
                        <FiTrash2 className='size-4' />
                        <p className='sm:hidden block'>Trash Notes</p>
                    </button>




                </div>

            </div>





            {/* user icon */}
            <div className="relative">
                <div
                    className="flex items-center gap-3  rounded-md cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img src={profile} alt="profile" className="w-14 sm:w-10 h-8 rounded-md object-cover" />
                    <div className='flex flex-col sm:hidden'>
                        <span className="font-medium text-gray-700">{userInfo?.username}</span>
                        <span className="font-normal text-xs -mt-1 text-gray-950">{userInfo?.email}</span>
                    </div>
                </div>

                {dropdownOpen && (
                    <div className="absolute left-6 bottom-8 w-52 bg-white shadow-lg rounded-xl p-1 border border-gray-200 z-50">

                        <div className='flex justify-start p-2 items-center gap-2 mb-1 '>
                            <img src={profile} alt="profile" className="w-10 h-9 rounded-md object-cover" />
                            <div className='flex flex-col'>
                                <span className="font-medium text-gray-700">{userInfo?.username}</span>
                                <span className="font-normal text-xs -mt-1 text-gray-950">{userInfo?.email}</span>
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