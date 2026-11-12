import React from 'react';
import { Sparkles, FileText, Layers, CheckCircle2 } from 'lucide-react';
import { UniversityDocument } from '../types.ts';

interface HeroBannerProps {
  documents: UniversityDocument[];
  onOpenUpload: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  documents,
  onOpenUpload,
  onSelectPrompt,
}) => {
  const totalPages = documents.reduce((sum, d) => sum + d.pageCount, 0);
  const totalChunks = documents.reduce((sum, d) => sum + d.chunkCount, 0);

  return (
    <div className="bg-gradient-to-b from-purple-50/70 via-white to-transparent pt-6 pb-4 border-b border-purple-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Academic Welcome & Information */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-purple-700 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Retrieval-Augmented Generation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
              Study Smarter with Answers <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">
                Grounded in Your Course Notes
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Upload university lecture slides, syllabus notes, and textbook chapters. The assistant uses genuine Gemini File Search and semantic retrieval to find exact source pages, deliver step-by-step mathematical solutions, and cite every fact.
            </p>

            {/* Unboxed Metadata Stats with typographic separators */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600 pt-2 border-t border-purple-100">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="font-mono tabular-nums font-bold text-slate-900">{documents.length}</span>
                <span>Course Documents</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Layers className="w-4 h-4 text-purple-600" />
                <span className="font-mono tabular-nums font-bold text-slate-900">{totalPages}</span>
                <span>Pages Indexed</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <span className="font-mono tabular-nums font-bold text-slate-900">{totalChunks}</span>
                <span>Semantic Chunks</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Gemini RAG Active</span>
              </div>
            </div>

            {/* Quick Test Prompt suggestions */}
            <div className="pt-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Sample Course Prompts:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectPrompt('Explain the Master Theorem cases for divide-and-conquer recurrences step by step')}
                  className="text-xs bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-md px-2.5 py-1.5 transition-colors text-left"
                >
                  Master Theorem Cases (CS 201)
                </button>
                <button
                  onClick={() => onSelectPrompt('Find the eigenvalues and eigenvectors of a 2x2 matrix with full step-by-step working')}
                  className="text-xs bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-md px-2.5 py-1.5 transition-colors text-left"
                >
                  Eigenvalues Step-by-Step (MATH 240)
                </button>
                <button
                  onClick={() => onSelectPrompt('How does the binding change mechanism of ATP Synthase generate ATP during chemiosmosis?')}
                  className="text-xs bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-md px-2.5 py-1.5 transition-colors text-left"
                >
                  ATP Synthase Mechanism (BIO 110)
                </button>
                <button
                  onClick={() => onSelectPrompt('What is the quantum teleportation protocol?')}
                  className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md px-2.5 py-1.5 transition-colors text-left italic"
                  title="Test how the assistant handles questions whose answers are absent from course documents"
                >
                  Absent Topic Test (Negative Verification)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity visual asset */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-md border border-purple-100 group">
              <img
                src="/src/assets/images/university_study_hero_1794462149447.jpg"
                alt="University student studying course materials with AI Study Assistant"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/25 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-xs font-semibold text-purple-200 tracking-wider uppercase">
                  Library Knowledge Base
                </span>
                <p className="text-xs font-medium text-slate-200">
                  Searchable by concept, proof, and chapter with real page citations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
