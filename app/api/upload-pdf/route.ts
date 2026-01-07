import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/models/Document";
import { ensureDirs, pdfPath, saveOriginalPdf } from "@/lib/storage";
import { sha256Buffer, sha256File } from "@/lib/hash";

export const POST = async (req: NextRequest) => {
  await connectDB();
  await ensureDirs();

  const formData = await req.formData();
  const file = formData.get("pdf") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const fileName = file.name;
  const docId = crypto.randomUUID();
  const filePath = await saveOriginalPdf(docId, buf);

  let originalHash;

  if (process.env.NODE_ENV === "development") {
    originalHash = await sha256File(pdfPath(docId));
  } else {
    originalHash = await sha256Buffer(buf);
  }

  const doc = await DocumentModel.create({
    docId,
    fileName,
    filePath,
    pageCount: 1,
    originalHash,
  });

  return NextResponse.json({ docId });
};
