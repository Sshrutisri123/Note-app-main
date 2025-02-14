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
            ListItem,
            Link.configure({
                openOnClick: true, // Open links in new tab
                autolink: true, // Auto-detect links
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
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
        toggleBulletList: () => editor?.commands.toggleBulletList(),
        addLink: () => {
            const url = prompt("Enter the URL:");
            if (url) {
                editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }
        },
        removeLink: () => editor?.chain().focus().unsetLink().run(),

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
