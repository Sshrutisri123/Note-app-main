
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Notespage from '../../components/Notespage/Notespage'
import CreateNote from '../../components/Createnotes/NoteEditor'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo1 from '../../assets/logo/logo1.jpg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {


  const { currentUser, loading, errorDispatch } = useSelector((state) => state.user)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [noteOpen, setnoteOpen] = useState(true);
  const [openSidebarMobile, setOpenSidebarMobile] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const handleOpenEditor = (note = null) => {
    setIsCreateOpen(true);
    setSelectedNote(note);
  }


  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])

  const [activeTab, setActiveTab] = useState("all")


  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser == null) {
      navigate('/Login')
    } else {
      setUserInfo(currentUser?.rest)
      getAllNotes()
    }
  }, [])

  // get all notes API
  const getAllNotes = async () => {
    try {
      const token = sessionStorage.getItem("authToken")

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/note/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.data.success === false) {
        console.log(res.data)
      }
      else {
        setAllNotes(res.data.note.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

    } catch (error) {
      console.log(error)
    }
  }

  // pinned notes

  const getPinnedNotes = async () => {
    try {
      const token = sessionStorage.getItem("authToken")

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/note/pinned`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (res.data.success === false) {
        console.log(res.data)
      }
      else {
        setAllNotes(res.data.note.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

    } catch (error) {
      console.log(error)
    }
  }
  //get trashed notes
  

  const getTrashNotes = async () => {
    try {
      const token = sessionStorage.getItem("authToken")

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/note/trash`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.data.success === false) {
        console.log(res.data)
      }
      else {
        setAllNotes(res.data.note.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

    } catch (error) {
      console.log(error)
    }


  }






  return (
    <div className='flex bg-gray-50 flex-col h-screen'>
      <ToastContainer />

      <div className='flex h-screen overflow-hidden'>
        <div className={`transform transition-transform duration-300 absolute sm:relative sm:left-auto left-0 h-full ${openSidebarMobile ? 'z-50  translate-x-0' : '-translate-x-full '} sm:translate-x-0 sm:block`}>
          <Sidebar getPinnedNotes={getPinnedNotes} getTrashNotes={getTrashNotes} getAllNotes={getAllNotes} userInfo={userInfo} setActiveTab={setActiveTab} />
        </div>

        {openSidebarMobile && <div onClick={() => setOpenSidebarMobile(false)}
          className='fixed top-0 left-0 w-full h-full bg-black sm:hidden opacity-50 z-40'>
        </div>}
        <div className={` transition-all duration-700 ease-in-out ${noteOpen ? "max-w-screen sm:max-w-[400px]" : " max-w-[0px]"}`}>
          <Notespage allNotes={allNotes} onNewNote={() => setIsCreateOpen(true)} setOpenSidebarMobile={setOpenSidebarMobile} getAllNotes={getAllNotes} activeTab={activeTab} onEditNote={handleOpenEditor} isCreateOpen={isCreateOpen} getTrashNotes={getTrashNotes} closeEditor={() => { setIsCreateOpen(false) }} />

        </div>
        <div className={`w-full h-full p-7 hidden sm:block transition-all ${isCreateOpen ? 'sm:hidden' : 'block'}`}>
          <div className='flex flex-col h-full justify-center items-center '>

            <div className='flex justify-center items-center size-28 rounded-xl shadow-lg drop-shadow-lg border'>
              <div className='flex justify-center items-center size-20 rounded-xl shadow-xl drop-shadow-lg border'>
                <img className='size-14 rounded-xl shadow-xl drop-shadow-lg ' src={logo1} alt="" />
              </div>
            </div>

            <h1 className='font-semibold text-4xl mt-6'>Think, Memorize and Write</h1>
            <h3 className='font-medium text-3xl mt-3 text-gray-500'>all in one place</h3>
          </div>
        </div>


        <div className={`transition-all duration-300 ease-in-out z-50 ${isCreateOpen ? 'translate-x-0 sm:block' : 'translate-x-full sm:hidden'} fixed top-0 right-0 w-full sm:static sm:translate-x-0 sm:w-full sm:h-full sm:shadow-none sm:transition-none`}>
          <CreateNote
            onClose={() => {
              setIsCreateOpen(false);
              setSelectedNote(null);
            }}
            activeTab={activeTab}
            getAllNotes={getAllNotes}
            selectedNote={selectedNote}
            noteClose={() => { setnoteOpen(!noteOpen) }}
          />
        </div>
      </div>
    </div >
  )
}

export default Home