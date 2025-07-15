import sharp from "sharp";
import path from "path";
import fs from "fs";

const MM_TO_PX = 10;

export async function generateGemstoneImage(
  shape: string,
  size: number
): Promise<string> {
  const gemstonePx = Math.round(size * MM_TO_PX); // 👈 Ensure it's an integer
  const base = path.resolve("public/assets/coin.png");
  const shapeImage = path.resolve(
    `public/assets/round.png`
  );
  const outputName = `${shape.toLowerCase()}_${size}mm.png`;
  const outputPath = path.resolve("public/previews", outputName);

  if (!fs.existsSync(outputPath)) {
    await sharp(base)
      .composite([
        {
          input: await sharp(shapeImage).resize(gemstonePx).toBuffer(),
          top: 100,
          left: 100,
        },
      ])
      .toFile(outputPath);
  }

  return outputName;
}
