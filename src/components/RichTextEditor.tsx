"use client";

import React, { useRef, useEffect } from "react";
import { Bold, Italic, Underline, Heading, List, ListOrdered, Quote, Link as LinkIcon, RemoveFormatting, Sparkles } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write detailed description...",
  label = "Description & Details",
  required = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize external value with innerHTML without losing focus/cursor position
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only set innerHTML if content meaningfully differs (e.g. initial load or reset)
      if (value === "" || !editorRef.current.contains(document.activeElement)) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const exec = (command: string, valueArg: string | undefined = undefined) => {
    document.execCommand(command, false, valueArg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Enter Link URL (e.g. https://example.com):", "https://");
    if (url && url !== "https://") {
      exec("createLink", url);
    }
  };

  return (
    <div className="w-full">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        {label} {required && <span className="text-rose-400">*</span>}
      </label>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-md focus-within:border-emerald-500 transition-all">
        {/* WYSIWYG Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900/90 border-b border-slate-800/80 select-none">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("bold");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Bold text"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("italic");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Italic text"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("underline");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Underline text"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("formatBlock", "<h3>");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-0.5 text-xs font-bold"
            title="Heading 3"
          >
            <Heading className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("insertUnorderedList");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5 text-teal-400" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("insertOrderedList");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5 text-teal-400" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("formatBlock", "<blockquote>");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Quote Box"
          >
            <Quote className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleInsertLink();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[11px]">Add Link</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("removeFormat");
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors ml-auto"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ContentEditable Real WYSIWYG Box (Zero HTML Tags Visible) */}
        <div
          ref={editorRef}
          contentEditable
          onInput={() => {
            if (editorRef.current) {
              onChange(editorRef.current.innerHTML);
            }
          }}
          data-placeholder={placeholder}
          className="w-full min-h-[140px] max-h-72 overflow-y-auto p-4 text-xs text-slate-100 focus:outline-none leading-relaxed prose prose-invert max-w-none prose-emerald empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500"
        />
      </div>
    </div>
  );
};
