import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UniversityDocument } from '../types.ts';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentUploaded: (newDoc: UniversityDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentUploaded,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setUploadSuccess(false);

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF file (.pdf).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit. Please upload a smaller PDF.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setProgressPercent(15);
    setUploadStep('Uploading PDF document to server...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulate progressive stages for UX feedback while server handles parsing & indexing
      const stepInterval = setInterval(() => {
        setProgressPercent(prev => {
          if (prev < 40) {
            setUploadStep('Parsing PDF pages and formatting chapters...');
            return prev + 15;
          } else if (prev < 75) {
            setUploadStep('Computing semantic embeddings with gemini-embedding-2...');
            return prev + 15;
          } else if (prev < 90) {
            setUploadStep('Syncing with Gemini File Search Store...');
            return prev + 5;
          }
          return prev;
        });
      }, 500);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(stepInterval);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload and index document.');
      }

      setProgressPercent(100);
      setUploadStep('Document successfully indexed and ready for queries!');
      setUploadSuccess(true);
      onDocumentUploaded(data.document);

      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setProgressPercent(0);
        setUploadSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setIsUploading(false);
      setProgressPercent(0);
      setErrorMessage(err.message || 'An error occurred during upload.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 max-w-lg w-full p-6 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload Course Material</h2>
            <p className="text-xs text-slate-500">
              Upload PDF lecture slides, syllabus notes, or textbooks for RAG indexing.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4">
          {/* Dropzone */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-purple-600 bg-purple-50/70'
                : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
            } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {selectedFile ? selectedFile.name : 'Click to select or drag & drop a PDF'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports searchable PDF notes up to 25MB with page-by-page extraction.
            </p>
          </div>

          {/* Selected File Details */}
          {selectedFile && !isUploading && !uploadSuccess && (
            <div className="bg-purple-50/60 border border-purple-100 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-5 h-5 text-purple-700 shrink-0" />
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1"
              >
                Remove
              </button>
            </div>
          )}

          {/* Progress State */}
          {isUploading && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-2 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-700" />
                  {uploadStep}
                </span>
                <span className="font-mono tabular-nums font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Document indexed successfully! You can now ask questions about it.</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || uploadSuccess}
            className="px-4 py-2 text-xs font-medium text-white bg-purple-700 hover:bg-purple-800 active:scale-98 rounded-lg shadow-xs transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Indexing...</span>
              </>
            ) : (
              <span>Start Indexing</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
