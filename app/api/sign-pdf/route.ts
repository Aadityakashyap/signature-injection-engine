import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/models/Document";
import { Audit } from "@/models/Audit";
import { ensureDirs, pdfPath, signedPath, publicUrlFor } from "@/lib/storage";
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
  const origHash = await sha256File(origPath);

  const originalBytes = await fs.readFile(origPath);
  const signedBytes = await burnSignatureIntoPdf(
    Uint8Array.from(originalBytes),
    signatureDataUrl,
    placements
  );

  const signedOutPath = signedPath(docId);
  await fs.writeFile(signedOutPath, signedBytes);
  const finalHash = await sha256Buffer(signedBytes);

  await Audit.create({
    docId,
    action: "sign",
    hashBefore: origHash,
    hashAfter: finalHash,
    payloadSummary: { placementCount: placements.length },
  });

  const signedUrl = publicUrlFor(signedOutPath);
  return NextResponse.json({ signedUrl });
};
