import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from '@tiptap/extension-bullet-list';
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item';
import { useEffect } from "react";
import { forwardRef, useImperativeHandle } from "react";

const TextEditor = forwardRef(({ content, onChange }, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false, // Disable built-in bold
                italic: false, // Disable built-in italic
            }),
            Bold, // Manually add bold
            Italic, // Manually add italic
            Underline,
            BulletList, 
            ListItem,// Underline is not included in StarterKit, so it's fine
        ],
        content: content || "<p></p>",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });


    useImperativeHandle(ref, () => ({
        toggleBold: () => editor?.chain().focus().toggleBold().run(),
        toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
        toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
        toggleBulletList: () => editor?.commands.toggleBulletList()

    }));

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className="py-4">
            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
});

export default TextEditor;
