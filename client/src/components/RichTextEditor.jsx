import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, Heading1, Heading2, Quote } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-white/5 bg-white/[0.03] backdrop-blur-md rounded-t-[24px]">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-xl hover:bg-white/10 transition-all ${editor.isActive('bold') ? 'bg-accent-purple/20 text-accent-purple shadow-lg shadow-accent-purple/10' : 'text-white/40'}`}
        type="button"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-xl hover:bg-white/10 transition-all ${editor.isActive('italic') ? 'bg-accent-purple/20 text-accent-purple shadow-lg shadow-accent-purple/10' : 'text-white/40'}`}
        type="button"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/5 mx-1 my-auto" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-xl hover:bg-white/10 transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-accent-purple/20 text-accent-purple shadow-lg shadow-accent-purple/10' : 'text-white/40'}`}
        type="button"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-xl hover:bg-white/10 transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-accent-purple/20 text-accent-purple shadow-lg shadow-accent-purple/10' : 'text-white/40'}`}
        type="button"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/5 mx-1 my-auto" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-xl hover:bg-white/10 transition-all ${editor.isActive('bulletList') ? 'bg-accent-purple/20 text-accent-purple shadow-lg shadow-accent-purple/10' : 'text-white/40'}`}
        type="button"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-xl hover:bg-white/10 transition-all ${editor.isActive('blockquote') ? 'bg-accent-purple/20 text-accent-purple shadow-lg shadow-accent-purple/10' : 'text-white/40'}`}
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
        class: 'prose prose-invert max-w-none min-h-[250px] px-6 py-4 focus:outline-none prose-p:text-white/70 prose-headings:text-white',
      },
    },
  });

  return (
    <div className="border border-white/10 rounded-[24px] overflow-hidden focus-within:border-accent-purple/50 transition-all duration-300 bg-white/[0.01]">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
