import React, { useState } from 'react';
import {
  FileText,
  Trash2,
  Eye,
  RotateCcw,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';
import { UniversityDocument } from '../types.ts';

interface DocumentLibraryProps {
  documents: UniversityDocument[];
  onOpenUpload: () => void;
  onInspectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onResetSamples: () => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  onOpenUpload,
  onInspectDocument,
  onDeleteDocument,
  onResetSamples,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const subjects = Array.from(new Set(documents.map(d => d.subject || 'General'))).filter(Boolean);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || doc.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from your library?`)) {
      setDeletingId(id);
      await onDeleteDocument(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Course Documents & Textbooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage course materials indexed in the Gemini File Search Store and vector knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetSamples}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            title="Reset default academic sample course documents"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Notes</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes, textbooks, subjects..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
          />
        </div>

        {subjects.length > 0 && (
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterSubject('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 ${
                filterSubject === 'all'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Subjects ({documents.length})
            </button>
            {subjects.map(subj => (
              <button
                key={subj}
                onClick={() => setFilterSubject(subj)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 ${
                  filterSubject === subj
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No documents matched your search term.'
              : 'Your library is currently empty. Upload a PDF or restore the default university study packs.'}
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 text-xs font-medium text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors"
            >
              Upload PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => {
            const isDeleting = deletingId === doc.id;
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-purple-300 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top row: Subject & Status */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100 text-[11px]">
                      {doc.subject || 'Academic Document'}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      {doc.status === 'ready' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Indexed & Ready</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                          <span className="text-amber-600">Indexing Chunks</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title & Filename */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1 truncate">
                      {doc.originalFileName}
                    </p>
                  </div>

                  {/* Unboxed metadata metrics */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span className="tabular-nums font-semibold text-slate-700">{doc.pageCount}</span>
                      <span>pages</span>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <div>
                      <span className="tabular-nums font-semibold text-slate-700">{doc.chunkCount}</span>
                      <span>chunks</span>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <div className="tabular-nums">
                      {(doc.fileSizeBytes / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onInspectDocument(doc.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-purple-700 hover:text-purple-900 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Chunks</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    disabled={isDeleting}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
