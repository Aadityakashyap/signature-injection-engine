import { PDFDocument, rgb } from "pdf-lib";
import { toPdfCoordinates } from "./coordinates";

export const burnSignatureIntoPdf = async (
  originalBytes: Uint8Array,
  signatureDataUrl: string,
  placements: {
    page: number;
    percentX: number;
    percentY: number;
    percentWidth: number;
    percentHeight: number;
    type: string;
    meta: any;
  }[]
) => {
  const pdfDoc = await PDFDocument.load(originalBytes);
  const sigBytes = dataUrlToBytes(signatureDataUrl);
  const sigImage = await pdfDoc.embedPng(sigBytes);

  placements.forEach((p) => {
    const page = pdfDoc.getPage(p.page - 1);
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const { x, y, boxW, boxH } = toPdfCoordinates({
      percentX: p.percentX,
      percentY: p.percentY,
      percentWidth: p.percentWidth,
      percentHeight: p.percentHeight,
      pageWidthPts: pageWidth,
      pageHeightPts: pageHeight,
    });

    const imgW = sigImage.width;
    const imgH = sigImage.height;
    const scale = Math.min(boxW / imgW, boxH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = x + (boxW - drawW) / 2;
    const drawY = y + (boxH - drawH) / 2;

    if (p.type === "text" && p.meta?.value) {
      const lines = p.meta.value.split("\n");
      const fontSize = 12;
      const lineHeight = fontSize + 2;

      lines.forEach((line:any, i:number) => {
        page.drawText(line, {
          x,
          y: y + boxH - (i + 1) * lineHeight,
          size: fontSize,
          color: rgb(0, 0, 0),
          maxWidth: pageWidth - x,
        });
      });
    }

    if (p.type === "signature" && signatureDataUrl) {
      page.drawImage(sigImage, {
        x: drawX,
        y: drawY,
        width: drawW,
        height: drawH,
      });
    }
  });

  const signedBytes = await pdfDoc.save();
  return signedBytes;
};

const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  const [, base64] = dataUrl.split(",");
  return Uint8Array.from(Buffer.from(base64, "base64"));
};
