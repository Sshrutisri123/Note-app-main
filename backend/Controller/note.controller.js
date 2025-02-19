import notes from '../Models/notes.model.js';
import { errorHndler } from '../utils/error.js';

export const addNote = async (req, res, next) => {
    const { title, content, tags } = req.body;

    const { id } = req.user;

    if (!title || !content) {
        return next(errorHndler(400, "Title and Content are required"));
    }

    try {
        const newNote = new notes({
            title,
            content,
            tags: tags || [],
            userId: id,
        });

        await newNote.save();

        res.status(201).json({
            success: true,
            message: "Note added successfully",
            newNote,
        });
    } catch (error) {
        return next(error);
    }
}

export const editNote = async (req, res, next) => {
    const note = await notes.findById(req.params.noteId);

    if (!note) {
        return next(errorHndler(404, "Note not found"));
    }

    if (req.user.id !== note.userId) {
        return next(errorHndler(403, "You are not authorized to edit this note"));
    }

    const { title, content, tags, isPinned } = req.body;

    if (!title && !content) {
        return next(errorHndler(400, "No changes made"));
    }

    try {
        if (title) {
            note.title = title;
        }
        if (content) {
            note.content = content;
        }

        if (tags) {
            note.tags = tags;
        }
        if (isPinned !== undefined) {  // ✅ Fix: Update isPinned even when false
            note.isPinned = isPinned;
        }

        await note.save();

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note,
        });

    } catch (error) {
        return next(error);
    }
}
export const moveToTrash = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        const note = await notes.findByIdAndUpdate(noteId, { deletedAt: new Date() }, { new: true });
        if (!note) {
            return next(errorHndler(404, "Note not found"));
        }
        res.status(200).json({
            success: true,
            message: "notes moved to trash successfully",
        });
    }
    catch (error) {
        return next(error);
    }
}

export const getAllNotes = async (req, res, next) => {
    const userId = req.user.id

    try {
        const note = await notes.find({ userId, deletedAt: null});

        res.status(200).json({
            success: true,
            message: "All notes fetched successfully",
            note,
        });

    } catch (error) {
        return next(error);
    }
}

export const getPinnedNotes = async (req, res, next) => {
    const userId = req.user.id

    try {
        const note = await notes.find({ userId, deletedAt: null, isPinned: true});

        res.status(200).json({
            success: true,
            message: "Pinned notes fetched successfully",
            note,
        });

    } catch (error) {
        return next(error);
    }
}


export const deleteNote = async (req, res, next) => {
    const noteId = req.params.noteId;

    const note = await notes.findOne({ _id: noteId, userId: req.user.id });

    if (!note) {
        return next(errorHndler(404, "Note not found"));
    }

    try {
        await notes.deleteOne({ _id: noteId, userId: req.user.id })

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return next(error);
    }
}

export const restoreNote = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        const note = await notes.findByIdAndUpdate(noteId, { deletedAt: null }, { new: true });
        if (!note) {
            return next(errorHndler(404, "Note not found"));
        }
        res.status(200).json({
            success: true,
            message: "Note restore successfully",
        });
    }
    catch (error) {
        return next(error);
    }
}

export const trashNotes = async (req, res, next) => {
    const userId = req.user.id

    try {
        const note = await notes.find({userId , deletedAt: { $ne: null}});

        res.status(200).json({
            success: true,
            message: "trashed notes fetched successfully",
            note,
        });

    } catch (error) {
        return next(error);
    }
}
