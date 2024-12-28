'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import TextStyle from '@tiptap/extension-text-style';
import './table.modules.css'
import { useState } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaLink,
  FaImage,
  FaTable,
  FaListUl,
} from 'react-icons/fa';

const Home1 = ({ setContent, content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Underline,
      Highlight,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    
  });

  const addImage = () => {
    const url = prompt('Enter image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  };

  const addLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor?.chain().focus().toggleLink({ href: url }).run();
    }
  };

  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  return (
    <div className=" bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-8">
    
        {/* Toolbar */}
        <div className="toolbar flex flex-wrap gap-2 mb-4 justify-start items-center border-b border-gray-300 pb-4">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
              editor?.isActive('bold')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
              editor?.isActive('italic')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded ${
              editor?.isActive('underline')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`p-2 rounded ${
              editor?.isActive('strike')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaStrikethrough />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded ${
              editor?.isActive('highlight')
                ? 'bg-yellow-300 text-gray-800'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            H
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded ${
              editor?.isActive({ textAlign: 'left' })
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaAlignLeft />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded ${
              editor?.isActive({ textAlign: 'center' })
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaAlignCenter />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded ${
              editor?.isActive({ textAlign: 'right' })
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaAlignRight />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded ${
              editor?.isActive({ textAlign: 'justify' })
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaAlignJustify />
          </button>
          <button
            onClick={addLink}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <FaLink />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <FaImage />
          </button>
          <button
            onClick={addTable}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <FaTable />
          </button>
          <button
            onClick={toggleBulletList}
            className={`p-2 rounded ${
              editor?.isActive('bulletList')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaListUl />
          </button>
          <input
            type="color"
            onChange={(e) =>
              editor?.chain().focus().setColor(e.target.value).run()
            }
            className="ml-2"
          />
        </div>

        {/* Editor Container */}
        <div className="editor-container bg-white border prose1 border-gray-300 rounded-lg p-4 mb-6 min-h-[300px]">
          <EditorContent editor={editor} />
        </div>

        {/* Preview Section */}
        <div className="preview-container">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview:</h2>
          <div
            className="p-4 border border-gray-300 bg-gray-50 rounded-lg text-gray-800 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home1;
