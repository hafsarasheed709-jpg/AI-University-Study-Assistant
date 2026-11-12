import express, { Request, Response } from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { RAGService } from './server/ragService.ts';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Body parsers
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Multer memory storage configuration for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB limit for PDF files
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents (.pdf) are supported for indexing.'));
    }
  },
});

// API Routes

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'AI University Study Assistant',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Get all documents
app.get('/api/documents', (_req: Request, res: Response) => {
  try {
    const docs = RAGService.getDocuments();
    res.json({ success: true, documents: docs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to fetch documents' });
  }
});

// Get single document with chunks
app.get('/api/documents/:id', (req: Request, res: Response) => {
  try {
    const doc = RAGService.getDocument(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }
    res.json({ success: true, document: doc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to fetch document' });
  }
});

// Upload and index PDF
app.post('/api/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
      return;
    }

    const doc = await RAGService.uploadAndIndexPDF(
      req.file.buffer,
      req.file.originalname,
      req.file.size
    );

    res.json({
      success: true,
      message: `Document "${doc.title}" uploaded and queued for indexing.`,
      document: doc,
    });
  } catch (err: any) {
    console.error('Upload route error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to process and index PDF' });
  }
});

// Delete document
app.delete('/api/documents/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await RAGService.deleteDocument(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to delete document' });
  }
});

// Reset seed documents
app.post('/api/documents/reset', (_req: Request, res: Response) => {
  try {
    RAGService.resetSeedDocuments();
    res.json({ success: true, message: 'Sample documents reset successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to reset documents' });
  }
});

// Chat Query RAG endpoint
app.post('/api/chat/query', async (req: Request, res: Response) => {
  try {
    const { query, documentIds, conversationHistory, studyMode } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Query is required.' });
      return;
    }

    const result = await RAGService.queryRAG(
      query.trim(),
      documentIds,
      conversationHistory || [],
      studyMode || 'detailed'
    );

    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Chat query error:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to execute grounded query',
    });
  }
});

// Flashcard study generation
app.post('/api/study/flashcards', async (req: Request, res: Response) => {
  try {
    const { documentId } = req.body;
    const flashcards = await RAGService.generateFlashcards(documentId);
    res.json({ success: true, flashcards });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to generate flashcards' });
  }
});

// Server boot with Vite middleware integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AI University Study Assistant server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
