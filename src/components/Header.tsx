import React from 'react';
import { UploadCloud, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'library' | 'flashcards';
  setActiveTab: (tab: 'chat' | 'library' | 'flashcards') => void;
  onOpenUpload: () => void;
  documentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            AI University Study Assistant
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('chat')}
            className={`transition-colors whitespace-nowrap py-1 relative ${
              activeTab === 'chat'
                ? 'text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Study Chat
            {activeTab === 'chat' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`transition-colors whitespace-nowrap py-1 relative ${
              activeTab === 'library'
                ? 'text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Documents
            {activeTab === 'library' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`transition-colors whitespace-nowrap py-1 relative ${
              activeTab === 'flashcards'
                ? 'text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flashcard Deck
            {activeTab === 'flashcards' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 active:scale-98 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
