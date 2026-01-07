import fs from "fs/promises";
import path from "path";
import { supabaseServer } from "./supabase";

const DATA_DIR = process.env.DATA_DIR || "./data";
const PDF_DIR = path.join(DATA_DIR, "pdfs");
const SIGNED_DIR = path.join(DATA_DIR, "signed");

export const ensureDirs = async () => {
  if (process.env.NODE_ENV === "development") {
    await fs.mkdir(PDF_DIR, { recursive: true });
    await fs.mkdir(SIGNED_DIR, { recursive: true });
  }
};

export const pdfPath = (docId: string) => {
  if (process.env.NODE_ENV === "development") {
    return path.join(PDF_DIR, `${docId}.pdf`);
  } else {
    return `pdfs/${docId}.pdf`;
  }
};

export const signedPath = (docId: string) => {
  if (process.env.NODE_ENV === "development") {
    return path.join(SIGNED_DIR, `${docId}-signed.pdf`);
  } else {
    return `signed/${docId}-signed.pdf`;
  }
};

export const saveOriginalPdf = async (docId: string, buf: Buffer) => {
  if (process.env.NODE_ENV === "development") {
    await fs.writeFile(pdfPath(docId), buf);
    return pdfPath(docId);
  } else {
    const fileName = `pdfs/${docId}.pdf`;
    const { error } = await supabaseServer.storage
      .from("pdfs")
      .upload(fileName, buf, { contentType: "application/pdf", upsert: true });

    if (error) throw error;
    return fileName;
  }
};

export const saveSignedPdf = async (docId: string, buf: Buffer) => {
  if (process.env.NODE_ENV === "development") {
    await fs.writeFile(signedPath(docId), buf);
    return signedPath(docId);
  } else {
    const fileName = `signed/${docId}-signed.pdf`;
    const bucket = supabaseServer.storage.from("pdfs");
    const { data: files, error: listError } = await bucket.list("signed", {
      search: `${docId}-signed.pdf`,
    });
    if (listError) throw listError;

    if (files && files.length > 0) {
      const { error: removeError } = await bucket.remove([fileName]);
      if (removeError) throw removeError;
    }

    const { error: uploadError } = await bucket.upload(fileName, buf, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (uploadError) throw uploadError;

    return fileName;
  }
};

export const publicUrlFor = async (pathname: string) => {
  if (process.env.NODE_ENV === "development") {
    const base = process.env.BASE_URL || "http://localhost:3000";
    return `${base}/api/file?path=${encodeURIComponent(pathname)}`;
  } else {
    const { data } = await supabaseServer.storage
      .from("pdfs")
      .getPublicUrl(pathname);

    return data.publicUrl;
  }
};

export const supabaseFileBuffer = async (fileName: string) => {
  const { data, error } = await supabaseServer.storage
    .from("pdfs")
    .download(fileName);
  if (error) throw error;

  const arrayBuffer = await data.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);

  return buf;
};
