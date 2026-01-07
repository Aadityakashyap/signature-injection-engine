"use client";
import React, { useRef, useState } from "react";

const CanvasSignatureModal = ({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: (dataUrl: string) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  if (!open) return null;

  const start = (e: React.MouseEvent) => {
    setDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const end = () => {
    setDrawing(false);
    setLastPos(null);
  };
  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastPos) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.quadraticCurveTo(lastPos.x, lastPos.y, x, y);
      ctx.stroke();
    }
    setLastPos({ x, y });
  };
  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const done = () => {
    onDone(canvasRef.current!.toDataURL("image/png"));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass p-4 w-204">
        <h3 className="text-lg font-medium mb-2">Draw Your Signature</h3>
        <canvas
          ref={canvasRef}
          width={780}
          height={280}
          className="bg-white rounded-md cursor-crosshair"
          onMouseDown={start}
          onMouseUp={end}
          onMouseMove={draw}
          onMouseLeave={end}
        />
        <div className="mt-3 flex gap-2">
          <button
            className="btn-full"
            onClick={clear}
          >
            Clear
          </button>
          <button
            className="btn-full-success px-4 py-2"
            onClick={done}
          >
            Use Signature
          </button>
          <button
            className="btn-full ml-auto"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default CanvasSignatureModal;
