import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/models/Document";
import { Audit } from "@/models/Audit";
import {
  ensureDirs,
  pdfPath,
  publicUrlFor,
  saveSignedPdf,
  supabaseFileBuffer,
} from "@/lib/storage";
import { sha256File, sha256Buffer } from "@/lib/hash";
import fs from "fs/promises";
import { burnSignatureIntoPdf } from "@/lib/pdf";
import { FieldType } from "@/components/FieldPalette";

export const POST = async (req: NextRequest) => {
  await connectDB();
  await ensureDirs();
  const body = await req.json();
  const { docId, signatureDataUrl, placements } = body as {
    docId: string;
    signatureDataUrl: string;
    placements: {
      page: number;
      percentX: number;
      percentY: number;
      percentWidth: number;
      percentHeight: number;
      type: FieldType;
      meta: Record<string, any>;
    }[];
  };

  const doc = await DocumentModel.findOne({ docId });
  if (!doc)
    return NextResponse.json({ error: "Doc not found" }, { status: 404 });

  const origPath = pdfPath(docId);
  let origHash;
  let originalBytes;

  if (process.env.NODE_ENV === "development") {
    origHash = await sha256File(pdfPath(docId));
    originalBytes = await fs.readFile(origPath);
  } else {
    originalBytes = await supabaseFileBuffer(origPath);
    origHash = await sha256Buffer(originalBytes);
  }

  const signedBytes = await burnSignatureIntoPdf(
    Uint8Array.from(originalBytes),
    signatureDataUrl,
    placements
  );

  const finalHash = await sha256Buffer(signedBytes);
  const signedKeyOrPath = await saveSignedPdf(docId, Buffer.from(signedBytes));
  await Audit.findOneAndDelete({ docId });

  await Audit.create({
    docId,
    action: "sign",
    hashBefore: origHash,
    hashAfter: finalHash,
    payloadSummary: { placementCount: placements.length },
  });

  const signedUrl = await publicUrlFor(signedKeyOrPath);
  return NextResponse.json({ signedUrl });
};
