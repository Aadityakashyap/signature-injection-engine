import { NextRequest } from "next/server";
import fs from "fs/promises";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const p = searchParams.get("path");
  if (!p) return new Response("missing", { status: 400 });
  const bytes = await fs.readFile(p);
  const ext = p.endsWith(".pdf")
    ? "application/pdf"
    : "application/octet-stream";
  return new Response(bytes, { headers: { "Content-Type": ext } });
};
