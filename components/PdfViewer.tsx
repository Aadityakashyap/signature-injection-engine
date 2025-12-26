"use client";

import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "pdfjs-dist/build/pdf.worker.min.mjs";

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

type Props = {
  fileUrl: string;
  page: number;
  onPageSize?: (size: { width: number; height: number }) => void;
  children?: React.ReactNode;
};

const PdfViewer = ({ fileUrl, page, onPageSize, children }: Props) => {
  const [dims, setDims] = useState<{ width: number; height: number } | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto glass p-2"
    >
      <Document
        file={fileUrl}
      >
        <Page
          pageNumber={page}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onLoadSuccess={(page) => {
            const viewport = page.getViewport({ scale: 1 });
            const scale =
              (containerRef.current?.clientWidth ?? viewport.width) /
              viewport.width;
            const scaledViewport = page.getViewport({ scale });
            setDims({
              width: scaledViewport.width,
              height: scaledViewport.height,
            });
            onPageSize?.({
              width: scaledViewport.width,
              height: scaledViewport.height,
            });
          }}
          width={dims?.width}
        />
      </Document>
      {dims && (
        <div
          className="absolute left-0 top-0"
          style={{ width: dims.width, height: dims.height }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
