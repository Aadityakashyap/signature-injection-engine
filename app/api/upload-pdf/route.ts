import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/models/Document";
import { ensureDirs, pdfPath } from "@/lib/storage";
import { sha256File } from "@/lib/hash";
import fs from "fs/promises";

export const POST = async (req: NextRequest) => {
  await connectDB();
  await ensureDirs();

  const formData = await req.formData();
  const file = formData.get("pdf") as File | null;

  let buf: Buffer;
  let fileName = "uploaded.pdf";
  let docId: string;

  if (file) {
    buf = Buffer.from(await file.arrayBuffer());
    fileName = file.name;
    docId = crypto.randomUUID();
    await fs.writeFile(pdfPath(docId), buf);
  }

  const originalHash = await sha256File(pdfPath(docId));
  await DocumentModel.create({
    docId,
    fileName,
    filePath: pdfPath(docId),
    pageCount: 1,
    originalHash,
  });

  return NextResponse.json({ docId });
};
