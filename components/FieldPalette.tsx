"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export type FieldType = "text" | "signature" | "image" | "date" | "radio";

const Sidebar = () => {
  const items: { type: FieldType; label: string }[] = [
    { type: "text", label: "Text" },
    { type: "signature", label: "Signature" },
    { type: "image", label: "Image" },
    { type: "date", label: "Date" },
    { type: "radio", label: "Radio" },
  ];

  const dragStart = (e: React.DragEvent, type: FieldType) => {
    e.dataTransfer.setData("field/type", type);
  };

  return (
    <aside className="sidebar">
      <div className="md:max-h-[70vh] h-full">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer text-white">
            <div className="flex items-center gap-1">
              <Link href="/" className="block">
                <Image
                  src="/logo.svg"
                  alt="Signature Injection Engine"
                  className="w-auto h-7"
                  width={30}
                  height={30}
                />
              </Link>
              <Link href="/" className="font-bold text-xl">
                Signature Injection Engine
              </Link>
            </div>
          </div>
        </div>

        <nav className="mt-6 md:h-full overflow-y-auto text-left">
          <span className="text-xl font-medium mb-2">Fields: (Draggable)</span>
          <hr />
          {items.map((i) => (
            <Fields
              key={i.type}
              label={i.label}
              onDragStart={(e) => dragStart(e, i.type)}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

interface FieldsProps {
  label: string;
  onDragStart: (e: React.DragEvent<HTMLButtonElement>) => void;
}

const Fields: React.FC<FieldsProps> = ({ label, onDragStart }) => {
  return (
    <div className="mt-6 flex w-full flex-col gap-2">
      <button
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[calc(var(--radius)/2)] border border-btn-border text-sm font-medium text-white transition hover:border-white"
        draggable={true}
        onDragStart={onDragStart}
      >
        {label}
      </button>
    </div>
  );
};
