"use client";

import React from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";

interface LessonNotesTabProps {
  notes?: PortableTextBlock[];
}

const customPortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 mt-8 mb-4 tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 mt-8 mb-3 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans font-bold text-lg text-neutral-900 mt-6 mb-2">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-base text-neutral-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#EA580C] pl-4 py-1 italic text-neutral-600 my-4 bg-[#FFF8F5]/50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 mb-4 text-neutral-700 leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 mb-4 text-neutral-700 leading-relaxed">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target ? "noopener noreferrer" : undefined}
          className="text-[#EA580C] underline decoration-[#EA580C]/40 hover:decoration-[#EA580C] font-medium transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-neutral-100 text-neutral-800 font-mono text-xs px-1.5 py-0.5 rounded border border-neutral-200">
        {children}
      </code>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  types: {
    code: ({ value }: { value: { code?: string; language?: string } }) => (
      <div className="my-6 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 text-neutral-100">
        {value.language && (
          <div className="bg-neutral-800/80 px-4 py-1.5 text-[11px] font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-700/50">
            {value.language}
          </div>
        )}
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code>{value.code}</code>
        </pre>
      </div>
    ),
  },
};

export function LessonNotesTab({ notes }: LessonNotesTabProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500 bg-white border border-neutral-200/80 rounded-2xl p-8">
        <p className="text-sm">No notes provided for this lesson yet.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-neutral max-w-none">
      <PortableText value={notes} components={customPortableTextComponents} />
    </div>
  );
}
