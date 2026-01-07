"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import { useRef, useState } from "react";

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [signedData, setSignedData] = useState<any[]>([]);
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

  const viewSignedFile = async (docId: string) => {};

  const deleteSignedFile = async (docId: string) => {};

  return (
    <>
      <Header />
      <section className="w-full px-8 py-6 flex flex-col items-center flex-wrap justify-between gap-12">
        <div className="Blob purple" />
        <div className="Blob pink" />
        <div className="w-full flex flex-col items-center justify-center">
          <div className="banner">
            <div className="text-white text-xl font-bold leading-[1.38] mb-2">
              Signature Injection Engine
            </div>
            <div className="text-[16px] text-light">
              Upload a PDF and place fields responsively. Then burn-in
              signatures with audit trail.
            </div>
          </div>
        </div>

        <div className="w-full space-y-6">
          <div
            className="relative w-full border border-border rounded-xl flex flex-col items-center justify-center text-center select-none"
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
              <div className="text-xl font-semibold text-btn-over">
                {file
                  ? `File Name: ${file.name}`
                  : "No file. Choose file first."}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end gap-4 w-full">
            {docId ? (
              <div className="text-light text-base grid w-full grid-cols-3 gap-4">
                <p className="flex h-10 w-full items-center justify-center gap-2 text-sm font-medium transition text-green col-start-1">
                  {file && file.name} Uploaded Successfully!
                </p>
                <a
                  className="flex h-10 w-full items-center justify-center gap-2 btn-full-success col-start-3"
                  href={`/editor/${docId}`}
                >
                  Open Editor for Uploaded PDF
                </a>
              </div>
            ) : (
              <div className="text-light text-base grid w-full grid-cols-3 gap-4">
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
                  className="flex h-10 w-full items-center justify-center gap-2 col-start-3 btn-full"
                  onClick={upload}
                >
                  {loading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
            <div className="md:col-span-2">
              <div className="p-6 rounded-(--radius) shadow-md shadow-border/20 border border-border">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg">Recent Documents</h5>
                </div>
                <div className="overflow-x-auto p-0 rounded-[calc(var(--radius)/2)] mt-3">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="py-3 px-4 text-light font-medium text-sm">
                          ID
                        </th>
                        <th className="py-3 px-4 text-light font-medium text-sm">
                          File Name
                        </th>
                        <th className="py-3 px-4 text-light font-medium text-sm">
                          Status
                        </th>
                        <th className="py-3 px-4 text-light font-medium text-sm hidden md:table-cell">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {signedData?.map((item, id) => (
                        <tr key={`${id}`} className="border-t border-gray-200">
                          <td className="my-3 mx-4 line-clamp-1 overflow-hidden">
                            {id + 1}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded inline-block">
                              File Name
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded inline-block">
                              View File
                            </span>
                          </td>
                          <td className="py-4 px-4 text-nowrap hidden md:table-cell">
                            <span className="w-full flex gap-2">
                              <button
                                className="flex h-10 w-full items-center justify-center gap-2 btn-full-success col-start-3"
                                onClick={() => viewSignedFile(item.docId)}
                              >
                                View
                              </button>
                              <button
                                className="flex h-10 w-full items-center justify-center gap-2 border-border bg-border hover:bg-border col-start-3 btn-full"
                                onClick={() => deleteSignedFile(item.docId)}
                              >
                                Delete
                              </button>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
