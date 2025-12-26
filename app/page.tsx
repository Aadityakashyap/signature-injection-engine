"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import { useRef, useState } from "react";

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("pdf", file);

      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const json: { docId: string } = await res.json();
      setDocId(json.docId);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="w-full px-8 py-6 flex flex-col items-center flex-wrap justify-between gap-12">
        <div className="Blob purple fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-477 h-433.75 shrink-0" />
        <div className="Blob pink fixed right-0 top-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-458.5 h-449.75 shrink-0" />
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full h-36 rounded-xl flex flex-col items-center justify-center text-center bg-[url('/home-banner.png')] bg-cover bg-[#13151b40] backdrop-blur-[20px] select-none">
            <div className="text-white text-xl font-bold leading-[1.38] mb-2">
              Signature Injection Engine
            </div>
            <div className="text-[16px] text-gray-200">
              Upload a PDF and place fields responsively. Then burn-in
              signatures with audit trail.
            </div>
          </div>
        </div>

        <div className="w-full space-y-6">
          <div
            className="relative w-full border border-[#212433] rounded-[10px] flex flex-col items-center justify-center text-center select-none"
            onClick={handleImageClick}
          >
            <Image
              className="w-75 select-none"
              src="/no_projects.png"
              alt="No projects"
              width={300}
              height={300}
            />
            <div className="absolute bottom-10 flex flex-col items-center justify-center gap-4">
              <div className="text-xl font-semibold text-[#c82c7d]">
                {file
                  ? `File Name: ${file.name}`
                  : "No file. Choose file first."}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end gap-4 w-full">
            {docId ? (
              <div className="text-[#b1b5c9] text-base grid w-full grid-cols-3 gap-4">
                <p className="flex h-10 w-full items-center justify-center gap-2 text-sm font-medium transition text-green col-start-1">
                  {file && file.name} Uploaded Successfully!
                </p>
                <a
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-green/80 bg-green/90 text-sm font-medium text-white transition hover:bg-green col-start-3"
                  href={`/editor/${docId}`}
                >
                  Open Editor for Uploaded PDF
                </a>
              </div>
            ) : (
              <div className="text-[#b1b5c9] text-base grid w-full grid-cols-3 gap-4">
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFile(e.target.files?.[0] ?? null)
                  }
                  className="hidden"
                />
                <button
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#e179af] bg-[#da589b] text-sm font-medium text-white transition hover:bg-[#c82c7d] col-start-3"
                  onClick={upload}
                >
                  {loading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
