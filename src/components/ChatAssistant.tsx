import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  BookOpen,
  Bookmark,
  Trash2,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { ChatMessage, Citation, StudyMode, UniversityDocument } from '../types.ts';

interface ChatAssistantProps {
  documents: UniversityDocument[];
  onOpenUpload: () => void;
  onInspectDocument: (docId: string) => void;
  onOpenCitationDrawer: (citations: Citation[]) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  documents,
  onOpenUpload,
  onInspectDocument,
  onOpenCitationDrawer,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Welcome to your AI University Study Assistant! 🎓\n\nI am your dedicated academic tutor powered by **Gemini File Search RAG**. I answer your questions based **strictly on your uploaded course documents, lecture notes, and textbooks**.\n\n**How I help you study:**\n- **Grounded Answers**: Every explanation cites exact document names and page numbers.\n- **Step-by-Step Math & Algorithms**: Ask me to break down proofs, formulas, or algorithmic complexities step by step.\n- **Absence Check**: If a concept isn't in your notes, I will clearly let you know rather than hallucinating.\n\n*Select a sample question below or type any question about your course materials to get started!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGrounded: true,
      suggestedQuestions: [
        'Explain the Master Theorem cases for divide-and-conquer recurrences step by step',
        'Find the eigenvalues and eigenvectors of a 2x2 matrix with full step-by-step working',
        'How does the binding change mechanism of ATP Synthase generate ATP during chemiosmosis?',
        'What is the quantum teleportation protocol? (Out-of-domain test)',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>('all');
  const [studyMode, setStudyMode] = useState<StudyMode>('detailed');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Retrieving relevant chunks...');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial prompt passed from parent (e.g. from HeroBanner quick buttons)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      studyMode,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);
    setLoadingStage('Searching indexed documents with semantic vector retrieval...');

    try {
      // Periodic stage updates for smooth feedback
      const stageTimer = setTimeout(() => {
        setLoadingStage('Synthesizing grounded explanation with page citations...');
      }, 700);

      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          documentIds: selectedDocId === 'all' ? undefined : [selectedDocId],
          conversationHistory,
          studyMode,
        }),
      });

      clearTimeout(stageTimer);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to get answer from study assistant.');
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        isGrounded: data.isGrounded,
        notFoundInDocs: data.notFoundInDocs,
        suggestedQuestions: data.suggestedQuestions || [],
        studyMode,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `**Error:** ${err.message || 'Unable to connect to study assistant backend.'}\n\nPlease verify that your Gemini API key is configured or select an API key in the Settings > Secrets panel.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isGrounded: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear current conversation history?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Chat history cleared. What course topic would you like to explore now?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: [
            'What is the difference between aerobic glycolysis and fermentation?',
            'What is the time complexity of Dijkstra with a min-heap?',
            'Explain the Spectral Theorem for symmetric matrices',
          ],
        },
      ]);
    }
  };

  const handleExportChat = () => {
    const text = messages
      .map(
        m =>
          `[${m.timestamp}] ${m.role === 'user' ? 'STUDENT' : 'AI STUDY ASSISTANT'}:\n${m.content}\n${
            m.sources && m.sources.length > 0
              ? `\nSOURCES:\n${m.sources.map(s => `- ${s.documentName} (Page ${s.pageNumber})`).join('\n')}\n`
              : ''
          }\n----------------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Study_Session_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple Markdown-to-HTML parser for formatted text, math and citations
  const renderFormattedText = (text: string) => {
    // Split by code blocks or format lines
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl font-extrabold text-slate-900 mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // List items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5 text-xs sm:text-sm leading-relaxed">
            {renderInlineMarkdown(line.slice(2))}
          </li>
        );
      }
      // Numbered items
      if (/^\d+\.\s/.test(line)) {
        const itemNumber = line.match(/^(\d+\.)\s/)?.[1];
        const rest = line.replace(/^\d+\.\s/, '');
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-purple-700 shrink-0 font-mono">{itemNumber}</span>
            <span>{renderInlineMarkdown(rest)}</span>
          </div>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (str: string) => {
    // Bold: **text**
    const parts = str.split(/(\*\*.*?\*\*|\`.*?\`|\[.*?,\s*Page\s*\d+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-mono text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded text-[11px] border border-purple-100">
            {part.slice(1, -1)}
          </code>
        );
      }
      // In-text citation: [DocName, Page X]
      if (/^\[.*,\s*Page\s*\d+\]$/.test(part)) {
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-purple-900 bg-purple-100/90 px-1.5 py-0.2 rounded border border-purple-200 mx-1 align-baseline cursor-pointer hover:bg-purple-200 transition-colors"
            title="Click 'View Citations' below to read full excerpt"
          >
            <Bookmark className="w-2.5 h-2.5 text-purple-700" />
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 flex flex-col h-[750px] overflow-hidden">
        {/* Chat Control Toolbar */}
        <div className="px-5 py-3 border-b border-purple-100 bg-purple-50/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Document Context Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <BookOpen className="w-4 h-4 text-purple-700 shrink-0" />
              <span className="font-medium">Course Scope:</span>
              <select
                value={selectedDocId}
                onChange={e => setSelectedDocId(e.target.value)}
                className="text-xs border border-purple-200 rounded-md px-2.5 py-1 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all">All Indexed Documents ({documents.length})</option>
                {documents.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Study Mode Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span className="font-medium">Mode:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 border border-purple-200 rounded-lg">
                <button
                  onClick={() => setStudyMode('detailed')}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                    studyMode === 'detailed'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Concept Deep-Dive
                </button>
                <button
                  onClick={() => setStudyMode('step_by_step_math')}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                    studyMode === 'step_by_step_math'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Step-by-step breakdowns for math formulas, proofs, and algorithms"
                >
                  Step-by-Step Math
                </button>
                <button
                  onClick={() => setStudyMode('quick_summary')}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                    studyMode === 'quick_summary'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="60-second high-yield revision summary"
                >
                  Quick Summary
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChat}
              className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-white rounded-md transition-colors"
              title="Export chat transcript"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-md transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-white via-purple-50/15 to-white">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-2xs transition-all ${
                  msg.role === 'user'
                    ? 'bg-purple-700 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs'
                }`}
              >
                {/* Assistant Title/Header */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        AI
                      </div>
                      <span className="font-semibold text-slate-800">Study Assistant</span>
                      {msg.isGrounded && !msg.notFoundInDocs && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Grounded in Notes</span>
                        </span>
                      )}
                      {msg.notFoundInDocs && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Topic Absent from Docs</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-1">
                  {msg.role === 'user' ? (
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-purple-50">
                      {msg.content}
                    </p>
                  ) : (
                    <div className="prose-xs max-w-none text-slate-800">
                      {renderFormattedText(msg.content)}
                    </div>
                  )}
                </div>

                {/* Citations Ribbon for Assistant Messages */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-purple-50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-purple-600" />
                        Retrieved Sources:
                      </span>
                      {msg.sources.map((src, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => onOpenCitationDrawer(msg.sources || [])}
                          className="flex items-center gap-1 text-[11px] font-mono font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded px-2 py-0.5 transition-colors"
                          title="Click to view exact text quote"
                        >
                          <span className="truncate max-w-[120px]">{src.documentName}</span>
                          <span className="text-purple-900 font-bold">p.{src.pageNumber}</span>
                          <span className="text-purple-500 text-[10px]">({src.similarityScore}%)</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onOpenCitationDrawer(msg.sources || [])}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                    >
                      View Excerpts →
                    </button>
                  </div>
                )}

                {/* Bottom actions for assistant bubble */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy explanation"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Questions */}
              {msg.role === 'assistant' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-2.5 max-w-[85%] space-y-1.5 pl-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Suggested Next Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(q)}
                        className="text-xs text-left bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-md px-2.5 py-1 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="bg-white border border-purple-200 rounded-2xl rounded-bl-xs p-4 shadow-2xs space-y-2 max-w-sm">
                <div className="flex items-center gap-2 text-xs font-medium text-purple-800">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
                  <span>{loadingStage}</span>
                </div>
                <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-700 h-full w-2/3 animate-pulse rounded-full" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Performing cosine vector comparison and grounding analysis
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-purple-100 bg-white shrink-0">
          <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 rounded-xl p-2 transition-all">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your course documents (e.g. formulas, algorithms, biological cycles)..."
              className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-none resize-none text-slate-800 placeholder-slate-400 leading-relaxed px-1"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-lg bg-purple-700 text-white hover:bg-purple-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs shrink-0"
              title="Send question (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 px-1 font-mono">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span className="flex items-center gap-1 text-purple-700">
              <Layers className="w-3 h-3" />
              <span>Full RAG pipeline with page-level citations</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
