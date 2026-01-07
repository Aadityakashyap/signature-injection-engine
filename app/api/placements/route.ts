import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/models/Document";
import { Placement } from "@/models/Placement";
import { ensureDirs, publicUrlFor } from "@/lib/storage";

export const GET = async (req: NextRequest) => {
  await connectDB();
  await ensureDirs();
  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("docId")!;
  const doc = await DocumentModel.findOne({ docId });
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const boxes = await Placement.find({ docId });
  const fileUrl = await publicUrlFor(doc.filePath);
  return NextResponse.json({
    meta: { fileUrl, pageCount: doc.pageCount ?? 1, docId },
    boxes,
  });
};

export const POST = async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  const { docId, boxes } = body as { docId: string; boxes: any[] };
  await Placement.deleteMany({ docId });
  await Placement.insertMany(boxes.map((b) => ({ ...b, docId })));
  return NextResponse.json({ ok: true });
};
