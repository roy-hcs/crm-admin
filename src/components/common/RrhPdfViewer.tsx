import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface RrhPdfViewerProps {
  url: string;
  className?: string;
}

export const RrhPdfViewer = ({ url, className }: RrhPdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn('overflow-y-auto', className)}>
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex items-center justify-center py-10">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        }
        error={
          <div className="text-destructive flex items-center justify-center py-10 text-sm">
            Failed to load PDF.
          </div>
        }
      >
        {numPages !== null &&
          Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={containerWidth || undefined}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="mb-2 last:mb-0"
            />
          ))}
      </Document>
    </div>
  );
};
