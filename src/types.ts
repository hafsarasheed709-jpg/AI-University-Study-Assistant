export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
}

export interface UniversityDocument {
  id: string;
  title: string;
  originalFileName: string;
  fileSizeBytes: number;
  pageCount: number;
  chunkCount: number;
  uploadedAt: string;
  status: 'indexing' | 'ready' | 'error';
  errorMessage?: string;
  subject?: string;
  chunks?: DocumentChunk[];
}

export interface Citation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  similarityScore: number;
  excerpt: string;
}

export type StudyMode = 'detailed' | 'step_by_step_math' | 'quick_summary' | 'exam_prep';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Citation[];
  isGrounded?: boolean;
  notFoundInDocs?: boolean;
  suggestedQuestions?: string[];
  studyMode?: StudyMode;
}

export interface Flashcard {
  front: string;
  back: string;
  source: string;
}
