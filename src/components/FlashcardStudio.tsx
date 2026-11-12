import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Loader2,
  Bookmark
} from 'lucide-react';
import { Flashcard, UniversityDocument } from '../types.ts';

interface FlashcardStudioProps {
  documents: UniversityDocument[];
}

export const FlashcardStudio: React.FC<FlashcardStudioProps> = ({ documents }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('all');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = async (docId?: string) => {
    setLoading(true);
    setError(null);
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const res = await fetch('/api/study/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId === 'all' ? undefined : docId }),
      });
      const data = await res.json();
      if (data.success && data.flashcards) {
        setFlashcards(data.flashcards);
      } else {
        throw new Error(data.error || 'Failed to generate flashcards.');
      }
    } catch (err: any) {
      setError(err.message || 'Error generating cards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards(selectedDocId);
  }, [selectedDocId]);

  const handleNext = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Course Flashcard Studio</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-medium">
              Grounded Retrieval
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            High-yield exam review cards generated directly from indexed course documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDocId}
            onChange={e => setSelectedDocId(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">All Course Documents ({documents.length})</option>
            {documents.map(d => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchFlashcards(selectedDocId)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors disabled:opacity-50"
            title="Regenerate cards from notes"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
          <p className="text-sm font-medium text-slate-700">Synthesizing flashcards from course materials...</p>
          <p className="text-xs text-slate-400">Extracting key definitions, proofs, and exam formulas</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {!loading && !error && flashcards.length > 0 && currentCard && (
        <div className="space-y-6">
          {/* Card Deck Progress Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              Card <strong className="text-purple-700">{currentIndex + 1}</strong> of {flashcards.length}
            </span>
            <span>Click card to reveal answer & citation</span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[280px] p-8 rounded-2xl border cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between text-center select-none ${
              isFlipped
                ? 'bg-purple-900 text-white border-purple-800'
                : 'bg-white text-slate-900 border-purple-100 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${
                  isFlipped ? 'text-purple-200' : 'text-purple-700'
                }`}
              >
                {isFlipped ? 'Answer & Explanation' : 'Study Question'}
              </span>
              <span className={`text-[11px] ${isFlipped ? 'text-purple-300' : 'text-slate-400'}`}>
                Click to flip
              </span>
            </div>

            <div className="my-auto py-4">
              <p
                className={`text-lg sm:text-xl font-semibold leading-relaxed ${
                  isFlipped ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="pt-3 border-t flex items-center justify-between text-xs">
              <span
                className={`flex items-center gap-1 font-mono text-[11px] ${
                  isFlipped ? 'border-purple-800/80 text-purple-200' : 'border-slate-100 text-slate-500'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Source: {currentCard.source}</span>
              </span>
              <span
                className={`text-[11px] font-medium ${
                  isFlipped ? 'text-purple-200' : 'text-purple-700'
                }`}
              >
                {isFlipped ? 'Answer Revealed' : 'Test Yourself'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs transition-all active:scale-98"
            >
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!loading && !error && flashcards.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No flashcards available</h3>
          <p className="text-xs text-slate-500">
            Upload course notes to automatically generate active-recall flashcards.
          </p>
        </div>
      )}
    </div>
  );
};
