import { useState, useEffect, useRef } from "react";
import { FiBold, FiItalic, FiUnderline, FiList, FiTrash, FiSave, FiX, FiLink2 } from "react-icons/fi";
import axios from "axios"
import { FiChevronDown, FiSidebar, FiPlus, FiMaximize2, FiMinimize2, FiTable } from "react-icons/fi";
import { TiPinOutline, TiPin } from "react-icons/ti";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Sidebar from "../Sidebar/Sidebar";
import TextEditor from "../TextEditor/TextEditor";
import { PiRectangleDuotone, PiColumnsDuotone } from "react-icons/pi";
import { TbBlockquote, TbAlignCenter, TbAlignLeft, TbAlignRight, TbHeading, TbH1, TbH2, TbH3, TbCode, TbTable, TbStrikethrough, TbTableOff, TbColumnRemove, TbTableColumn, TbRowRemove, TbTableRow } from "react-icons/tb";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { IoStarSharp } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { toast } from 'react-toastify'





const NoteEditor = ({ onClose, getAllNotes, selectedNote, noteClose, activeTab }) => {

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState([])
    const [inputTag, setInputTag] = useState("")
    const [isPinned, setIsPinned] = useState(false)
    const [error, setError] = useState(null)
    const [maximize, setmaximize] = useState(false)
    const editorRef = useRef(null);
    const [confirmTabs, setConfirmTab] = useState('')
    // handle confirm tab
    const handleConfirmTab = () => {
        setConfirmTab(renderTabs())
    }
    const [isTableOpen, setIsTableOpen] = useState(false);
    const dropdownRef = useRef(null);

    //drop down of tables
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsTableOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content || "<p><p/>");
            setTags(selectedNote.tags || []);
            setIsPinned(selectedNote.isPinned || false);
            handleConfirmTab();
        } else {
            setTitle("");
            setContent("<p></p>");
            setTags([]);
            setIsPinned(false)
        }
    }, [selectedNote]);

    // Rendering tabs
    const renderTabs = () => {
        if (activeTab === 'all') {
            return <p>All Notes</p>;
        }
        else if (activeTab === 'pinned') {
            return <p>Pinned Notes</p>
        }
        else if (activeTab === 'trash') {
            return <p>Trash Notes</p>
        }
        else {
            return <p>All Notes</p>
        }
    }


    //functions to apply bold 




    //toggle pin
    const pinnedNotify = () =>
        toast.success("Note Pinned successfully 📍", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
        });

    const unpinnedNotify = () =>
        toast.info("Note Unpinned Successfully 📌", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
        });

    const togglePin = () => {
        isPinned ? unpinnedNotify() : pinnedNotify()
        setIsPinned((prev) => (!prev))
    }

    // add tag
    const handleAddTag = () => {
        if (inputTag.trim() !== "" && !tags.includes(inputTag.trim())) {
            setTags([...tags, inputTag.trim()])
            setInputTag("")
        }
    }

    // delete tag
    const handleDeleteTag = (index) => {
        const updateTags = tags.filter((_, i) => i !== index)
        setTags(updateTags)
    }

    //trash note
    const trashNotify = () =>
        toast.error("Note moved to trash 🗑️ ", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
        });
    const trashNote = async () => {

        if (!selectedNote?._id) {
            console.error("Error: Note ID is missing!");
            setError("Note ID is missing!");
            return;
        }

        try {
            const token = sessionStorage.getItem("authToken")

            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/note/move-to-trash/${selectedNote._id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.data.success === false) {
                console.log(res.data.message)
                setError(res.data.message)
                return
            }

            await getAllNotes()
            trashNotify()
            onClose()

        } catch (error) {
            console.log(error.message)
            setError(error.message)
        }
    }

    //delete note
    const deleteNote = async () => {

        if (!selectedNote?._id) {
            console.error("Error: Note ID is missing!");
            setError("Note ID is missing!");
            return;
        }

        try {
            const token = sessionStorage.getItem("authToken")

            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/note/delete-note/${selectedNote._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.data.success === false) {
                console.log(res.data.message)
                setError(res.data.message)
                return
            }

            getAllNotes()
            onClose()

        } catch (error) {
            console.log(error.message)
            setError(error.message)
        }
    }

    //consfirm delete
    const confirmDelete = () => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            deleteNote(); // Ensure await is used properly
        }
    };


    // edit note
    const editNote = async () => {
        try {
            const token = sessionStorage.getItem("authToken")

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/note/edit-note/${selectedNote._id}`, { title, content, tags, isPinned }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.data.success === false) {
                console.log(res.data.message)
                setError(res.data.message)
                return
            }

            getAllNotes()
            onClose()

        } catch (error) {
            console.log(error.message)
            setError(error.message)
        }
    }

    // add note
    const createNotify = () =>
        toast.error("Note created successfully 😊 ", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
        });
    const addNote = async () => {
        try {
            const token = sessionStorage.getItem("authToken")

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/note/add-note`,
                { title, content, tags, isPinned },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

            if (res.data.success === false) {
                console.log(res.data.message)
                setError(res.data.message)
                return
            }

            getAllNotes()
            createNotify()
            onClose()

            setTitle("");
            setContent("");
            setIsPinned(false);
            setTags([]);


        } catch (error) {
            console.log(error.message)
            setError(error.message)
        }
    }

    return (
        <div className="flex flex-col w-dvw sm:w-full h-dvh sm:h-screen bg-white rounded-3xl">
            <div className="flex justify-between items-center border-b">
                <div className="flex items-center gap-x-3 px-4 py-4">
                    <button className="hover:bg-gray-200 rounded-md hidden sm:block p-1" onClick={noteClose}><FiSidebar /></button>
                    <div className="border-l px-3">
                        <Breadcrumbs selectedNote={selectedNote} confirmTabs={confirmTabs} />
                    </div>
                </div>
                <div className="px-2 flex">
                    {/* maximaize button */}
                    <button onClick={() => setmaximize(!maximize)} className="p-2 hidden sm:block rounded-md text-gray-950 hover:bg-gray-200">{maximize ? <FiMinimize2 /> : <FiMaximize2 />}</button>
                    {/* Close Button */}
                    <button onClick={onClose} className=" p-2 rounded-md text-gray-950 hover:bg-gray-200">
                        <FiX className="size-4" />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between border-b px-2 py-2 overflow-x-scroll sm:overflow-x-visible scrollbar-thin">
                <div className="flex gap-2">
                    <button onClick={() => editorRef.current?.toggleBold()} className="p-2 rounded-md hover:bg-gray-200" ><FiBold className="size-4" /></button>
                    <button onClick={() => editorRef.current?.toggleItalic()} className="p-2 rounded-md hover:bg-gray-200"><FiItalic className="size-4" /></button>
                    <button onClick={() => editorRef.current?.toggleUnderline()} className="p-2 rounded-md hover:bg-gray-200"><FiUnderline className="size-4" /></button>
                    <button onClick={() => editorRef.current?.toggleBulletList()} className="p-2 rounded-md hover:bg-gray-200"><FiList className="size-4" /></button>

                    <button onClick={() => editorRef.current?.toggleLink()} className="p-2 rounded-md hover:bg-gray-200">
                        <FiLink2 className="size-4" />
                    </button>
                    <button onClick={() => editorRef.current?.toggleBlockquote()} className="p-2 rounded-md hover:bg-gray-200"><TbBlockquote className="size-4" /></button>

                    <div className="relative group inline-block">
                        {/* Main "H" Button */}
                        <div className="p-2 rounded-md hover:bg-gray-200 flex items-center gap-2 cursor-pointer">
                            <TbHeading className="size-5" />
                        </div>

                        {/* Hidden H1, H2, H3 buttons (appear on hover) */}
                        <div className="absolute left-0 mt-1 hidden flex-col space-y-1 bg-white shadow-md p-2 rounded-md group-hover:flex">
                            <button onClick={() => editorRef.current?.toggleHeading(1)} className="p-2 rounded-md hover:bg-gray-200">
                                <TbH1 className="size-4" />
                            </button>
                            <button onClick={() => editorRef.current?.toggleHeading(2)} className="p-2 rounded-md hover:bg-gray-200">
                                <TbH2 className="size-4" />
                            </button>
                            <button onClick={() => editorRef.current?.toggleHeading(3)} className="p-2 rounded-md hover:bg-gray-200">
                                <TbH3 className="size-4" />
                            </button>
                        </div>
                    </div>

                    <button onClick={() => editorRef.current?.setTextAlignCenter()} className="p-2 rounded-md hover:bg-gray-200"><TbAlignCenter className="size-4" /></button>
                    <button onClick={() => editorRef.current?.setTextAlignLeft()} className="p-2 rounded-md hover:bg-gray-200"><TbAlignLeft className="size-4" /></button>
                    <button onClick={() => editorRef.current?.setTextAlignRight()} className="p-2 rounded-md hover:bg-gray-200"><TbAlignRight className="size-4" /></button>
                    <button onClick={() => editorRef.current?.toggleCodeBlock()} className="p-2 rounded-md hover:bg-gray-200"><TbCode className="size-4" /></button>
                    <button onClick={() => editorRef.current?.toggleHorizontalRule()} className="p-2 rounded-md hover:bg-gray-200"><MdOutlineHorizontalRule className="size-4" /></button>
                    <button
                        onClick={() => {
                            const url = prompt("Enter Image URL:");
                            if (url) {
                                editorRef.current?.addImage(url);
                            }
                        }}
                        className="p-2 rounded-md hover:bg-gray-200"
                    >
                        <FaImage className="size-4" />
                    </button>
                    <div ref={dropdownRef} onClick={() => setIsTableOpen(!isTableOpen)} className="relative group p-2 rounded-md hover:bg-gray-200 cursor-pointer"><FiTable className="size-4" />

                        {isTableOpen && (
                            <div className="absolute top-full -left-40 mt-2 flex bg-white shadow-md rounded-lg transition-opacity duration-200 border border-gray-300 p-1 z-10">

                                {/* add table */}
                                <button onClick={() => editorRef.current?.insertTable()} className="p-2 rounded-md hover:bg-gray-200"><FiTable className="size-4" /></button>

                                {/* insert row */}
                                <button onClick={() => editorRef.current?.addRowAfter()} className="p-2 rounded-md hover:bg-gray-200"><TbTableRow className="size-4" /></button>

                                {/* delete row */}
                                <button onClick={() => editorRef.current?.deleteRow()} className="p-2 rounded-md hover:bg-gray-200"><TbRowRemove className="size-4" /></button>

                                {/* insert coloum */}
                                <button onClick={() => editorRef.current?.addColumnAfter()} className="p-2 rounded-md hover:bg-gray-200"><TbTableColumn className="size-4" /></button>

                                {/* delete coloum */}
                                <button onClick={() => editorRef.current?.deleteColumn()} className="p-2 rounded-md hover:bg-gray-200"><TbColumnRemove className="size-4" /></button>

                                {/* merge cell */}
                                <button onClick={() => editorRef.current?.mergeCells()} className="p-2 rounded-md hover:bg-gray-200"><AiOutlineMergeCells className="size-4" /></button>

                                {/* split cell */}
                                <button onClick={() => editorRef.current?.splitCell()} className="p-2 rounded-md hover:bg-gray-200"><AiOutlineSplitCells className="size-4" /></button>

                                {/* toggle header coloum */}
                                <button onClick={() => editorRef.current?.toggleHeaderColumn()} className="p-2 rounded-md hover:bg-gray-200"><PiColumnsDuotone className="size-4" /></button>

                                {/* header cell */}
                                <button onClick={() => editorRef.current?.toggleHeaderCell()} className="p-2 rounded-md hover:bg-gray-200"><PiRectangleDuotone className="size-4" /></button>

                                {/* delete table */}
                                <button onClick={() => editorRef.current?.deleteTable()} className="p-2 rounded-md hover:bg-gray-200"><TbTableOff className="size-4" /></button>

                            </div>
                        )}
                    </div>

                    <button onClick={() => editorRef.current?.toggleStrike()} className="p-2 rounded-md hover:bg-gray-200"><TbStrikethrough className="size-4" /></button>










                </div>
                <div className="flex gap-2">
                    <button className="px-2 py-1 rounded-md hover:bg-gray-200" onClick={togglePin}>
                        {isPinned ? <IoStarSharp className="size-5" /> : <IoStarOutline className="size-5" />}
                    </button>
                    <button className="px-2 py-1 rounded-md hover:bg-gray-200" onClick={() => (activeTab === 'trash' ? confirmDelete() : trashNote())} ><FiTrash className="size-4" /></button>
                    <button className="flex items-center px-2 py-1 gap-2 text-sm font-light rounded-md text-white bg-gray-950"
                        onClick={selectedNote ? editNote : addNote}  ><FiSave className="size-4" /> {selectedNote ? "Update" : "Save"}</button>
                </div>


            </div>

            {/* Editor space */}
            <div className={`flex flex-col ${maximize ? "px-3" : "px-4 sm:px-52"} overflow-y-auto `}>

                <div className={`flex py-3 mt-9 `}>
                    {/* Title Input */}
                    <input
                        type="text"
                        className="w-full text-3xl font-bold focus:outline-none"
                        placeholder="Enter title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* tag and category */}
                <div className={`flex py-3 gap-2 `}>
                    <div className="flex items-center border py-1 px-2 rounded-md">
                        <input className="focus:outline-none text-sm"
                            type="text" placeholder="Add tags..."
                            value={inputTag}
                            onChange={(e) => setInputTag(e.target.value)} />
                        <button onClick={handleAddTag}><FiPlus /></button>
                    </div>
                </div>

                {/* Display Added Tags */}
                <div className={`flex flex-wrap gap-2 `}>
                    {tags.map((tag, index) => (
                        <div key={index} className="flex items-center bg-gray-200 py-1 px-2 rounded-md">
                            <span className="text-sm font-normal">{tag}</span>
                            <button onClick={() => handleDeleteTag(index)} className="ml-2 text-black"><FiX className="size-4" /></button>
                        </div>
                    ))}
                </div>

                {/* Editable Content Area */}
                <div
                    className="w-full h-full flex-grow text-gray-700  ">
                    <div className={`w-full flex-grow `}>
                        <TextEditor ref={editorRef} content={content} onChange={setContent} />
                    </div>
                </div>

            </div>





        </div >
    );

};

export default NoteEditor;