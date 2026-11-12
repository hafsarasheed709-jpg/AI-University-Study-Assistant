import React from 'react';
import { X, FileText, ExternalLink, Bookmark } from 'lucide-react';
import { Citation } from '../types.ts';

interface CitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  citations: Citation[];
  onInspectDocument: (documentId: string) => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  isOpen,
  onClose,
  citations,
  onInspectDocument,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-purple-100 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-purple-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Retrieved Grounding Sources</h2>
              <p className="text-xs text-slate-500 font-mono">
                {citations.length} document citation{citations.length !== 1 ? 's' : ''} retrieved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Citations List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            The Gemini model synthesized its answer using these exact semantic chunks retrieved from your university notes:
          </p>

          {citations.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-purple-100 bg-purple-50/20 hover:bg-white hover:border-purple-300 transition-all space-y-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-700 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {c.documentName}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono text-purple-800 bg-purple-100 rounded">
                  Page {c.pageNumber}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono border-b border-purple-50 pb-2">
                <span>Semantic Match:</span>
                <span className="font-semibold text-purple-700 tabular-nums">
                  {c.similarityScore}% confidence
                </span>
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line italic">
                "{c.excerpt}"
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => onInspectDocument(c.documentId)}
                  className="flex items-center gap-1 text-[11px] font-medium text-purple-700 hover:text-purple-900 transition-colors"
                >
                  <span>View in full document</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 shrink-0 flex items-center justify-between">
          <span>Zero-hallucination citation protocol.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
