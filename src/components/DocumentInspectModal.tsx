import React, { useEffect, useState } from 'react';
import { X, FileText, Layers, Loader2 } from 'lucide-react';
import { UniversityDocument } from '../types.ts';

interface DocumentInspectModalProps {
  documentId: string | null;
  onClose: () => void;
}

export const DocumentInspectModal: React.FC<DocumentInspectModalProps> = ({
  documentId,
  onClose,
}) => {
  const [doc, setDoc] = useState<UniversityDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePageFilter, setActivePageFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    if (!documentId) {
      setDoc(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/documents/${documentId}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success && data.document) {
          setDoc(data.document);
        } else {
          setError(data.error || 'Failed to load document details.');
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'Network error.');
      });
  }, [documentId]);

  if (!documentId) return null;

  const chunks = doc?.chunks || [];
  const pagesList = Array.from(new Set(chunks.map(c => c.pageNumber))).sort((a, b) => a - b);
  const filteredChunks = activePageFilter === 'all'
    ? chunks
    : chunks.filter(c => c.pageNumber === activePageFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-base font-bold text-slate-900 truncate">
                {doc ? doc.title : 'Loading document...'}
              </h2>
              {doc && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>{doc.originalFileName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{(doc.fileSizeBytes / 1024).toFixed(0)} KB</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{doc.pageCount} Pages</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{doc.chunkCount} Chunks</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-700" />
              <p className="text-sm">Loading indexed semantic chunks...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {doc && !loading && (
            <>
              {/* Filter tabs by page */}
              {pagesList.length > 1 && (
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 overflow-x-auto">
                  <span className="text-xs text-slate-500 font-medium">Filter by Page:</span>
                  <button
                    onClick={() => setActivePageFilter('all')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activePageFilter === 'all'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All ({chunks.length})
                  </button>
                  {pagesList.map(p => (
                    <button
                      key={p}
                      onClick={() => setActivePageFilter(p)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        activePageFilter === p
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Page {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Chunk list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Showing {filteredChunks.length} indexed chunks</span>
                  <span className="flex items-center gap-1 text-purple-700 font-medium">
                    <Layers className="w-3.5 h-3.5" />
                    Indexed for Semantic Vector Search
                  </span>
                </div>

                {filteredChunks.map((chunk, idx) => (
                  <div
                    key={chunk.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded text-[11px]">
                        Page {chunk.pageNumber} · Chunk #{chunk.chunkIndex + 1}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">ID: {chunk.id}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                      {chunk.text}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>RAG Pipeline parses exact page numbers for verifiable citation grounding.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
