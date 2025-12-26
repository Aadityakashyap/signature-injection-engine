"use client";
import React from "react";

const ResizeHandle = ({
  onResize,
}: {
  onResize: (dx: number, dy: number) => void;
}) => {
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const onMove = (ev: MouseEvent) =>
      onResize(ev.clientX - startX, ev.clientY - startY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return <div className="handle br" onMouseDown={onMouseDown} />;
};
export default ResizeHandle;
