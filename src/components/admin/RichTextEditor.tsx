'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Code,
} from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: { class: 'prose-bim min-h-[280px] max-w-none px-4 py-3 focus:outline-none' },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (res.ok && data.url) {
      editor?.chain().focus().setImage({ src: data.url }).run();
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink-200 bg-ink-50 p-2">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('link')}
          onClick={() => {
            const url = window.prompt('Nhập URL liên kết:');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileRef.current?.click()}>
          <ImageIcon size={15} />
        </ToolbarButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
            e.target.value = '';
          }}
        />
        <span className="mx-1 h-5 w-px bg-ink-200" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={15} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md text-ink-600 hover:bg-white',
        active && 'bg-accent-500 text-white hover:bg-accent-600'
      )}
    >
      {children}
    </button>
  );
}
