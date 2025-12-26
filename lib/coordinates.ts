export const toPdfCoordinates = ({
  percentX,
  percentY,
  percentWidth,
  percentHeight,
  pageWidthPts,
  pageHeightPts,
}: {
  percentX: number;
  percentY: number;
  percentWidth: number;
  percentHeight: number;
  pageWidthPts: number;
  pageHeightPts: number;
}) => {
  const x = percentX * pageWidthPts;
  const yTop = percentY * pageHeightPts;
  const boxW = percentWidth * pageWidthPts;
  const boxH = percentHeight * pageHeightPts;
  const y = pageHeightPts - yTop - boxH;
  return { x, y, boxW, boxH };
};
