import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import { useEffect, forwardRef, useImperativeHandle } from "react";

const TextEditor = forwardRef(({ content, onChange }, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: true,
                bold: false,
                italic: false,
                bulletList: false,
                listItem: false,
                blockquote: false,
                heading: false,
            }),
            Bold,
            Italic,
            Underline,
            BulletList,
            ListItem,
            Link.configure({
                openOnClick: true,
                autolink: true,
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
            Highlight,
            Blockquote,
            Heading.configure({
                levels: [1, 2, 3],
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
        toggleHighlight: () => {
            const isActive = editor?.isActive("highlight");
            if (isActive) {
                editor?.chain().focus().unsetMark("highlight").run();
            } else {
                editor?.chain().focus().toggleHighlight({ color: "yellow" }).run();
            }
        },
        toggleLink: () => {
            const isActive = editor?.isActive("link");
            if (isActive) {
                editor?.chain().focus().unsetLink().run();
            } else {
                const url = prompt("Enter the URL:");
                if (url) {
                    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }
            }
        },
        toggleBlockquote: () => editor?.chain().focus().toggleBlockquote().run(),
        toggleHeading: (level) => editor?.chain().focus().toggleHeading({ level }).run(),

    }));

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className="py-4">
            <EditorContent editor={editor} />
        </div>
    );
});

export default TextEditor;
