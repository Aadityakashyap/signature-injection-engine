"use client";
import React, { useState } from "react";
import ResizeHandle from "./ResizeHandle";
import type { FieldType } from "./FieldPalette";

export type FieldBox = {
  id: string;
  type: FieldType;
  percentX: number;
  percentY: number;
  percentWidth: number;
  percentHeight: number;
  page: number;
  meta?: Record<string, any>;
};

type Props = {
  box: FieldBox;
  pageWidth: number;
  pageHeight: number;
  onChange: (next: FieldBox) => void;
  selected?: boolean;
  onSelect?: () => void;
  onDelete: () => void;
};

const DraggableField = ({
  box,
  pageWidth,
  pageHeight,
  onChange,
  selected,
  onSelect,
  onDelete,
}: Props) => {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const left = box.percentX * pageWidth;
  const top = box.percentY * pageHeight;
  const width = box.percentWidth * pageWidth;
  const height = box.percentHeight * pageHeight;

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - left, y: e.clientY - top });
    onSelect?.();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const nx = (e.clientX - offset.x) / pageWidth;
    const ny = (e.clientY - offset.y) / pageHeight;
    onChange({
      ...box,
      percentX: Math.max(0, Math.min(1 - box.percentWidth, nx)),
      percentY: Math.max(0, Math.min(1 - box.percentHeight, ny)),
    });
  };

  const onMouseUp = () => setDragging(false);

  const onResize = (dx: number, dy: number) => {
    const nw = Math.max(20, width + dx) / pageWidth;
    const nh = Math.max(20, height + dy) / pageHeight;
    onChange({
      ...box,
      percentWidth: Math.min(1 - box.percentX, nw),
      percentHeight: Math.min(1 - box.percentY, nh),
    });
  };

  function autoResizeBox(val: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = "12px sans-serif";

    const lines = val.split("\n");
    const maxLineWidthPx =
      Math.max(...lines.map((line) => ctx.measureText(line).width)) + 12;

    const lineHeight = 16;
    const heightPx = Math.max(lineHeight, lines.length * lineHeight);

    const newPercentWidth = Math.min(
      maxLineWidthPx / pageWidth,
      1 - box.percentX
    );
    const newPercentHeight = Math.min(heightPx / pageHeight, 1 - box.percentY);

    onChange({
      ...box,
      percentWidth: newPercentWidth,
      percentHeight: newPercentHeight,
      meta: { ...box.meta, value: val },
    });
  }

  return (
    <div
      className={`field-box ${selected ? "border-primary-400" : ""}`}
      style={{ left, top, width, height, cursor: "move" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div className="flex justify-end items-center">
        <button
          type="button"
          className="field-label ml-2 text-red-400 hover:text-red-600 text-sm z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ✕
        </button>
      </div>
      <div
        className={`${
          box.type !== "text" &&
          "absolute inset-0 flex items-center justify-center text-sm text-neutral-900"
        }`}
      >
        {box.type === "text" && (
          <>
            {(() => {
              const value = box.meta?.value ?? "";
              const isMultiline = value.includes("\n") || value.length > 40;

              if (isMultiline) {
                return (
                  <textarea
                    value={value}
                    onChange={(e) => {
                      const val = e.target.value;
                      autoResizeBox(val);
                      onChange({ ...box, meta: { ...box.meta, value: val } });
                    }}
                    className="resize-none drag-input"
                    placeholder="Enter text..."
                  />
                );
              }

              return (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    autoResizeBox(val);
                    onChange({ ...box, meta: { ...box.meta, value: val } });
                  }}
                  className="drag-input"
                  placeholder="Enter text..."
                />
              );
            })()}
          </>
        )}
        {box.type === "signature" ? "Sign Here" : box.type.toUpperCase()}
      </div>

      <ResizeHandle onResize={onResize} />
    </div>
  );
};

export default DraggableField;
