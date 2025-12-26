import crypto from "crypto";
import fs from "fs/promises";

export const sha256File = async (filePath: string) => {
  const buf = await fs.readFile(filePath);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  return hash;
};

export const sha256Buffer = async (buf: Uint8Array | Buffer) => {
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  return hash;
};
