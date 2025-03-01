import React, { useState } from 'react'
import { FiPlus } from "react-icons/fi"
import Notecard from '../Notecard/Notecard'
import axios from 'axios'
import Searchbar from '../searchbar/searchbar'

import logo from '../../assets/logo/logo1.jpg'
import { toast } from 'react-toastify'


const Notespage = ({ onNewNote, getTrashNotes, allNotes, closeEditor, isCreateOpen, onEditNote, getAllNotes, activeTab, setOpenSidebarMobile }) => {
  // Rendering tabs
  const renderTabs = () => {
    if (activeTab === 'all') {
      return <p>All Notes</p>;
    }
    else if (activeTab === 'pinned') {
      return <p>Pinned Notes</p>
    }
    else if (activeTab === 'trash') {
      return <p>Trashed</p>
    }
    else {
      return <p>All Notes</p>
    }
  }
  //trash note
  const trashNotify = () =>
    toast.success("Note moved to trash 🗑️ ", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
    });
  const trashNote = async (noteId) => {
    try {
      const token = sessionStorage.getItem("authToken")

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/note/move-to-trash/${noteId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.data.success === false) {
        console.log(res.data.message)
        return
      }

      await getAllNotes()
      trashNotify()
      if (isCreateOpen) {
        closeEditor()
      }


    } catch (error) {
      console.log(error.message)
    }
  }

  //restrore
  const restoreNotify = () =>
    toast.success("Note restored successfully 🔄", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
    });

  const restoreNote = async (noteId) => {
    try {
      const token = sessionStorage.getItem("authToken")

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/note/restore-note/${noteId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.data.success === false) {
        console.log(res.data.message)
        return
      }

      await getTrashNotes()
      restoreNotify()
      if (isCreateOpen) {
        closeEditor()
      }


    } catch (error) {
      console.log(error.message)
    }
  }
  //delete note
  const deleteNotify = () =>
    toast.error("Note permanently deleted ❌", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
    });
  const deleteNote = async (noteId) => {
    try {
      const token = sessionStorage.getItem("authToken")

      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/note/delete-note/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.data.success === false) {
        console.log(res.data.message)
        return
      }

      await getAllNotes()
      deleteNotify()
      if (isCreateOpen) {
        closeEditor()
      }


    } catch (error) {
      console.log(error.message)
    }
  }

  //search query
  const [searchQuery, setSearchQuery] = useState('')
  const filterNotes = allNotes.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className='sm:w-80 w-dvw h-dvh sm:h-screen border-r'>

      <div className='flex flex-col w-full border-b justify-between gap-y-3 p-4'>

        <div className='flex w-full justify-between'>
          <img src={logo} onClick={() => setOpenSidebarMobile((prev) => !prev)} alt="Logo" className="w-7 sm:w-8 block sm:hidden h-auto rounded-lg" />

          <h1 className='font-instumrntalSans font-normal text-lg'>{renderTabs()}</h1>
          <button
            onClick={onNewNote}
            className='flex items-center gap-2 shadow-md bg-gray-950 text-white text-xs font-light py-1 px-2 rounded-lg'><FiPlus />New Note</button>
        </div>

        <Searchbar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />

      </div>




      <div className="content-start flex flex-col  overflow-y-auto overflow-x-hidden w-full h-[calc(100vh-100px)] gap-x-2">
        {filterNotes.length > 0 ? (
          filterNotes.map((note, index) => (
            <Notecard
              key={note._id}
              title={note.title}
              date={note.createdAt}
              tags={note.tags}
              isPinned={note.isPinned}
              content={note.content}
              onClick={() => onEditNote(note)}
              onTrash={() => trashNote(note._id)}
              onRestore={() => restoreNote(note._id)}
              activeTab={activeTab}

              onDelete={() => deleteNote(note._id)}
            />
          ))
        ) : (<p className='text-center mt-5'>Note note found</p>)
        }

      </div >
    </div >
  )
}

export default Notespage