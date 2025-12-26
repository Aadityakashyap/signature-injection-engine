import fs from "fs/promises";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";
const PDF_DIR = path.join(DATA_DIR, "pdfs");
const SIGNED_DIR = path.join(DATA_DIR, "signed");

export const ensureDirs = async () => {
  await fs.mkdir(PDF_DIR, { recursive: true });
  await fs.mkdir(SIGNED_DIR, { recursive: true });
};

export const pdfPath = (docId: string) => {
  return path.join(PDF_DIR, `${docId}.pdf`);
};

export const signedPath = (docId: string) => {
  return path.join(SIGNED_DIR, `${docId}-signed.pdf`);
};

export const publicUrlFor = (pathname: string) => {
  const base = process.env.BASE_URL || "http://localhost:3000";
  return `${base}/api/file?path=${encodeURIComponent(pathname)}`;
};
