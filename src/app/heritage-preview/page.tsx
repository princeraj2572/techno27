import { open, readdir, stat } from "fs/promises";
import path from "path";
import HeritageGallery, { type HeritageImage, type MissingImage } from "./HeritageGallery";

// TEMPORARY asset-preview page. To remove it later: delete src/app/heritage-preview/
// and public/heritage-preview/. Nothing else in the project depends on it.

export const metadata = {
  title: "India Heritage — Visual Assets",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic"; // re-scan the folder on every request

const FOLDER = "heritage-preview";

// Target filenames and what each image is (identified from the actual artwork).
const TARGETS: { file: string; title: string; note: string }[] = [
  { file: "01-sky-sun-clouds.png", title: "Sky, sun & clouds", note: "Sunrise over misty mountains and clouds" },
  { file: "02-main-heritage-city.png", title: "Main heritage city", note: "Palace city with the Taj Mahal-inspired monument" },
  { file: "03-middle-palace-city.png", title: "Middle palace city", note: "Central palace city and terraces" },
  { file: "04-bridges-waterfalls-valley.png", title: "Bridges, waterfalls & valley", note: "Arched bridges, waterfalls and the river valley" },
  { file: "05-foreground-temple-terrace.png", title: "Foreground temple terrace", note: "Temple towers and the stone terrace" },
  { file: "06-carved-temple-foreground.png", title: "Carved temple foreground", note: "Carved pillars, bells and elephant sculptures" },
  { file: "07-floral-heritage-panorama.png", title: "Floral heritage panorama", note: "Flower-framed heritage panorama" },
  { file: "08-ornate-arch-river-valley.png", title: "Ornate arch & river valley", note: "Carved stone arch above the river valley" },
  { file: "09-elephant-statue-city-view.png", title: "Elephant statue & city view", note: "Elephant sculpture overlooking the city" },
  { file: "10-golden-hour-heritage-city.png", title: "Golden-hour heritage city", note: "Golden-hour heritage panorama over the waterways" },
];

// PNG: width/height are 4-byte big-endian ints at bytes 16 and 20 (no dependency needed).
async function pngSize(file: string): Promise<{ width: number; height: number } | null> {
  const fh = await open(file, "r");
  try {
    const buf = Buffer.alloc(24);
    await fh.read(buf, 0, 24, 0);
    const isPng = buf.readUInt32BE(0) === 0x89504e47;
    if (!isPng) return null;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } finally {
    await fh.close();
  }
}

export default async function HeritagePreviewPage() {
  const dir = path.join(process.cwd(), "public", FOLDER);
  let present: string[] = [];
  try {
    present = await readdir(dir);
  } catch {
    present = [];
  }

  const images: HeritageImage[] = [];
  const missing: MissingImage[] = [];

  for (const [i, t] of TARGETS.entries()) {
    if (!present.includes(t.file)) {
      missing.push({ number: i + 1, file: t.file, title: t.title });
      continue;
    }
    const full = path.join(dir, t.file);
    const [{ size }, dims] = await Promise.all([stat(full), pngSize(full)]);
    images.push({
      number: i + 1,
      file: t.file,
      src: `/${FOLDER}/${t.file}`,
      title: t.title,
      note: t.note,
      bytes: size,
      width: dims?.width ?? 0,
      height: dims?.height ?? 0,
    });
  }

  return <HeritageGallery images={images} missing={missing} total={TARGETS.length} />;
}
