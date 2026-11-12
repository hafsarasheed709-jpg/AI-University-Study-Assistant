import { PDFParse } from 'pdf-parse';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedPDF {
  title: string;
  pageCount: number;
  pages: ExtractedPage[];
  fullText: string;
}

export async function extractTextFromPDFBuffer(buffer: Buffer, fileName: string): Promise<ExtractedPDF> {
  try {
    const parser = new PDFParse(buffer);
    let info: any = null;
    let fullText = '';
    const pages: ExtractedPage[] = [];

    try {
      info = await parser.getInfo();
    } catch {
      // Info might not be available in all PDFs
    }

    try {
      const parsedResult: any = await parser.getText();
      if (parsedResult) {
        if (typeof parsedResult.text === 'string') {
          fullText = parsedResult.text;
        }
        if (Array.isArray(parsedResult.pages)) {
          for (const p of parsedResult.pages) {
            if (p && typeof p.text === 'string' && p.text.trim().length > 0) {
              pages.push({
                pageNumber: p.num || pages.length + 1,
                text: p.text.trim(),
              });
            }
          }
        }
      }
    } catch (parseErr) {
      console.warn('PDF parser.getText failed, falling back to split extraction:', parseErr);
    }

    // If page-by-page extraction yielded empty pages but fullText exists, split by form feed or page markers
    if (pages.length === 0 && fullText.trim().length > 0) {
      const splitPages = fullText.split(/\f|\n(?=Page\s+\d+)/i);
      if (splitPages.length > 1) {
        splitPages.forEach((txt, idx) => {
          if (txt.trim().length > 0) {
            pages.push({
              pageNumber: idx + 1,
              text: txt.trim(),
            });
          }
        });
      } else {
        // Chunk fullText into ~1500 char pseudo-pages
        const chunkSize = 1500;
        for (let i = 0; i < fullText.length; i += chunkSize) {
          const slice = fullText.slice(i, i + chunkSize).trim();
          if (slice.length > 0) {
            pages.push({
              pageNumber: Math.floor(i / chunkSize) + 1,
              text: slice,
            });
          }
        }
      }
    }

    // Fallback if both returned minimal content (e.g. text-encoded PDF or buffer string)
    if (pages.length === 0) {
      const rawString = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\t]/g, ' ');
      const cleanString = rawString.replace(/\s+/g, ' ').trim();
      pages.push({
        pageNumber: 1,
        text: cleanString.slice(0, 4000) || `Uploaded PDF document: ${fileName}`,
      });
      fullText = pages[0].text;
    }

    const title = info?.title || fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    return {
      title,
      pageCount: pages.length,
      pages,
      fullText: fullText || pages.map(p => p.text).join('\n\n'),
    };
  } catch (err: any) {
    console.error('Error in extractTextFromPDFBuffer:', err);
    // Robust graceful fallback: extract readable ASCII strings
    const rawString = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\t]/g, ' ');
    const cleanString = rawString.replace(/\s+/g, ' ').trim();
    const fallbackText = cleanString.length > 50 ? cleanString.slice(0, 5000) : `University Document: ${fileName}`;
    return {
      title: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      pageCount: 1,
      pages: [{ pageNumber: 1, text: fallbackText }],
      fullText: fallbackText,
    };
  }
}
