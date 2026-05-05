import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, Heading1, Heading2, Quote } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('bold') ? 'bg-primary-100 text-primary-600' : ''}`}
        type="button"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('italic') ? 'bg-primary-100 text-primary-600' : ''}`}
        type="button"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 1 }) ? 'bg-primary-100 text-primary-600' : ''}`}
        type="button"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 2 }) ? 'bg-primary-100 text-primary-600' : ''}`}
        type="button"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('bulletList') ? 'bg-primary-100 text-primary-600' : ''}`}
        type="button"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('blockquote') ? 'bg-primary-100 text-primary-600' : ''}`}
        type="button"
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
};

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
      },
    },
  });

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
