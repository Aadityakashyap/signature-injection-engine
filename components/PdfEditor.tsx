"use client";
import React, { useEffect, useRef, useState } from "react";
import PdfViewer from "./PdfViewer";
import FieldPalette, { FieldType } from "./FieldPalette";
import DraggableField, { FieldBox } from "./DraggableField";
import CanvasSignatureModal from "./CanvasSignatureModal";

type DocMeta = { fileUrl: string; pageCount: number; docId: string };

const PdfEditor = ({ docId }: { docId: string }) => {
  const [meta, setMeta] = useState<DocMeta | null>(null);
  const [pageSize, setPageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [boxes, setBoxes] = useState<FieldBox[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sigOpen, setSigOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/placements?docId=${docId}`);
      const json = await res.json();
      setMeta(json.meta);
      setBoxes(json.boxes ?? []);
    })();
  }, [docId]);

  const addBoxFromDrop = (e: React.DragEvent) => {
    const type = e.dataTransfer.getData("field/type") as FieldType;
    if (!type || !pageSize) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const percentX = mx / pageSize.width;
    const percentY = my / pageSize.height;
    const percentWidth = 120 / pageSize.width;
    const percentHeight = 40 / pageSize.height;

    const id = crypto.randomUUID();
    const newBox: FieldBox = {
      id,
      type,
      percentX,
      percentY,
      percentWidth,
      percentHeight,
      page,
    };
    setBoxes((prev) => [...prev, newBox]);
  };

  const onSavePlacements = async () => {
    await fetch("/api/placements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId, boxes }),
    });
    alert("Placements saved.");
  };

  const onSign = async (dataUrl: string) => {
    const signBoxes = boxes.filter((b) => b.type === "signature");
    const textBoxes = boxes.filter((b) => b.type === "text");
    let placementBoxes: FieldBox[] = [];
    if (signBoxes.length > 0 && textBoxes.length > 0) {
      placementBoxes = [...signBoxes, ...textBoxes];
    } else if (signBoxes.length > 0) {
      placementBoxes = signBoxes;
    } else if (textBoxes.length > 0) {
      placementBoxes = textBoxes;
    } else {
      return alert("Place at least one signature box or text box.");
    }

    const res = await fetch("/api/sign-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docId,
        signatureDataUrl: dataUrl,
        placements: placementBoxes,
      }),
    });
    const json = await res.json();
    if (json.signedUrl) {
      window.open(json.signedUrl, "_blank");
    } else {
      alert("Signing failed");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addBoxFromDrop(e);
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const updateBox = (id: string, next: FieldBox) =>
    setBoxes((prev) => prev.map((b) => (b.id === id ? next : b)));

  return meta ? (
    <div className="grid grid-cols-[220px_1fr] gap-4 h-full">
      <FieldPalette />
      <div className="flex flex-col gap-3">
        <nav className="flex items-center gap-2 text-center backdrop-blur-(--blur) bg-aaccent transition-all duration-300 w-full px-4 py-2">
          <button
            className="btn-full"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span className="rounded-[calc(var(--radius)/2)] border border-btn-border text-sm font-medium text-white transition px-4 py-2">
            Page {page} / {meta.pageCount}
          </span>

          <button
            className="btn-full"
            onClick={() => setPage((p) => Math.min(meta.pageCount, p + 1))}
          >
            Next
          </button>

          <button className="btn-full ml-auto" onClick={onSavePlacements}>
            Save placements
          </button>
          <button className="btn-full" onClick={() => setSigOpen(true)}>
            Signature
          </button>
        </nav>

        <PdfViewer fileUrl={meta.fileUrl} page={page} onPageSize={setPageSize}>
          <div
            ref={overlayRef}
            className="absolute inset-0"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            {pageSize &&
              boxes
                .filter((b) => b.page === page)
                .map((b) => (
                  <DraggableField
                    key={b.id}
                    box={b}
                    pageWidth={pageSize.width}
                    pageHeight={pageSize.height}
                    onChange={(next) => updateBox(b.id, next)}
                    selected={selectedId === b.id}
                    onSelect={() => setSelectedId(b.id)}
                    onDelete={() =>
                      setBoxes((prev) => prev.filter((x) => x.id !== b.id))
                    }
                  />
                ))}
          </div>
        </PdfViewer>
      </div>

      <CanvasSignatureModal
        open={sigOpen}
        onClose={() => setSigOpen(false)}
        onDone={onSign}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default PdfEditor;
