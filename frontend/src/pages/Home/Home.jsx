import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Notespage from '../../components/Notespage/Notespage'
import CreateNote from '../../components/Createnotes/NoteEditor'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {


  const { currentUser, loading, errorDispatch } = useSelector((state) => state.user)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [noteOpen, setnoteOpen] = useState(true);
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
      const res = await axios.get("http://localhost:3000/api/note/all", { withCredentials: true })

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
  const getPinnedNotes = () => {
    const pinnedNotes = allNotes.filter(note => note.isPinned)
    setAllNotes(pinnedNotes)
  }



  return (
    <div className='flex bg-gray-50 flex-col h-screen'>
      <div className='flex h-screen overflow-hidden'>
        <div>
          <Sidebar getPinnedNotes={getPinnedNotes} getAllNotes={getAllNotes} userInfo={userInfo} setActiveTab={setActiveTab}/>
        </div>

        <div className={` transition-all duration-700 ease-in-out ${noteOpen ? "max-w-[400px]" : " max-w-0"}`}>
          <Notespage allNotes={allNotes}  onNewNote={() => setIsCreateOpen(true)} getAllNotes={getAllNotes} activeTab={activeTab} onEditNote={handleOpenEditor} isCreateOpen={isCreateOpen} closeEditor={() => { setIsCreateOpen(false) }} />

        </div>


        <div className={`w-full pb-4 transition-all ${isCreateOpen ? 'block' : 'hidden'}`}>

          <CreateNote
            onClose={() => {
              setIsCreateOpen(false);
              setSelectedNote(null);
            }}
            activeTab = {activeTab}
            getAllNotes={getAllNotes}
            selectedNote={selectedNote}
            noteClose={() => { setnoteOpen(!noteOpen) }}
          />
        </div>
      </div>
    </div>
  )
}

export default Home