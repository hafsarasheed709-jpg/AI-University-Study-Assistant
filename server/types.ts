export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  embedding?: number[];
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
  fileSearchStoreDocName?: string;
  subject?: string;
  chunks: DocumentChunk[];
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  similarity: number;
}

export interface Citation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  similarityScore: number;
  excerpt: string;
}

export interface RAGAnswerResponse {
  answer: string;
  sources: Citation[];
  isGrounded: boolean;
  notFoundInDocs: boolean;
  studyMode: 'detailed' | 'quick_summary' | 'step_by_step_math' | 'exam_prep';
  suggestedQuestions: string[];
}
