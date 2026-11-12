import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { ChatAssistant } from './components/ChatAssistant.tsx';
import { DocumentLibrary } from './components/DocumentLibrary.tsx';
import { FlashcardStudio } from './components/FlashcardStudio.tsx';
import { DocumentUploadModal } from './components/DocumentUploadModal.tsx';
import { DocumentInspectModal } from './components/DocumentInspectModal.tsx';
import { CitationDrawer } from './components/CitationDrawer.tsx';
import { UniversityDocument, Citation } from './types.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'flashcards'>('chat');
  const [documents, setDocuments] = useState<UniversityDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inspectDocId, setInspectDocId] = useState<string | null>(null);
  const [activeCitations, setActiveCitations] = useState<Citation[] | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);

  // Load documents from backend
  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.success && data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDocumentUploaded = (newDoc: UniversityDocument) => {
    setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newDoc.id)]);
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const handleResetSamples = async () => {
    try {
      const res = await fetch('/api/documents/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      }
    } catch (err) {
      console.error('Failed to reset sample documents:', err);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setActiveTab('chat');
    setSelectedPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-[#faf9fd] text-slate-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        documentCount={documents.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <>
            <HeroBanner
              documents={documents}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onSelectPrompt={handleSelectPrompt}
            />
            <ChatAssistant
              documents={documents}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onInspectDocument={docId => setInspectDocId(docId)}
              onOpenCitationDrawer={citations => setActiveCitations(citations)}
              initialPrompt={selectedPrompt}
              onClearInitialPrompt={() => setSelectedPrompt(undefined)}
            />
          </>
        )}

        {activeTab === 'library' && (
          <DocumentLibrary
            documents={documents}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onInspectDocument={docId => setInspectDocId(docId)}
            onDeleteDocument={handleDeleteDocument}
            onResetSamples={handleResetSamples}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardStudio documents={documents} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AI University Study Assistant</span>
            <span>—</span>
            <span>Empowering students with verifiable, grounded RAG citations.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Google Gemini 3.8 Flash & File Search</span>
            <button
              onClick={handleResetSamples}
              className="text-purple-700 hover:text-purple-900 hover:underline"
            >
              Reset Sample Syllabi
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentUploaded={handleDocumentUploaded}
      />

      <DocumentInspectModal
        documentId={inspectDocId}
        onClose={() => setInspectDocId(null)}
      />

      <CitationDrawer
        isOpen={!!activeCitations}
        onClose={() => setActiveCitations(null)}
        citations={activeCitations || []}
        onInspectDocument={docId => {
          setActiveCitations(null);
          setInspectDocId(docId);
        }}
      />
    </div>
  );
}
