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
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, common, createLowlight } from 'lowlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Strike from '@tiptap/extension-strike'




const TextEditor = forwardRef(({ content, onChange }, ref) => {
    const lowlight = createLowlight(common);

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
                codeBlock: false,
                horizontalRule: false,
                strike: false,



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
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'right', 'center'],
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }), 
            HorizontalRule,
            Image,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Strike,

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
        setTextAlignLeft: () => editor?.chain().focus().setTextAlign('left').run(),
        setTextAlignRight: () => editor?.chain().focus().setTextAlign('right').run(),
        setTextAlignCenter: () => editor?.chain().focus().setTextAlign('center').run(),
        toggleCodeBlock: () => editor?.chain().focus().toggleCodeBlock().run(),
        toggleHorizontalRule: () => editor?.chain().focus().setHorizontalRule().run(),
        addImage: (url) => {
            if (url) {
                editor?.chain().focus().setImage({ src: url }).run();
            }
        },
        toggleStrike: () => editor?.chain().focus().toggleStrike().run(),

        insertTable: () => editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run(),
        deleteTable: () => editor?.chain().focus().deleteTable().run(),
        addRowAfter: () => editor?.chain().focus().addRowAfter().run(),
        addColumnAfter: () => editor?.chain().focus().addColumnAfter().run(),
        deleteRow: () => editor?.chain().focus().deleteRow().run(),
        deleteColumn: () => editor?.chain().focus().deleteColumn().run(),
        mergeCells: () => editor?.chain().focus().mergeCells().run(),
        splitCell: () => editor?.chain().focus().splitCell().run(),
        toggleHeaderColumn: () => editor?.chain().focus().toggleHeaderColumn().run(),
        toggleHeaderCell: () => editor?.chain().focus().toggleHeaderCell().run(),




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
