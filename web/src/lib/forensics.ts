import type { PhotoAnalysis, PhotoSignal } from "./schemas";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load recompressed image"));
    img.src = dataUrl;
  });
}

async function sha256Fingerprint(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(hash);
  let hex = "";
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex.slice(0, 12);
}

/** Detect JPEG APP1 (EXIF) marker 0xFFE1 in the first bytes. Weak signal only. */
function detectExif(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4) return false;

  // JPEG: FF D8 ...
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 3 < bytes.length && offset < 65536) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      if (marker === 0xe1) {
        // APP1 — typically EXIF or XMP
        return true;
      }
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (length < 2) break;
      offset += 2 + length;
    }
    return false;
  }

  // PNG: rarely has EXIF in eXIf chunk
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  if (isPng) {
    const text = new TextDecoder("latin1").decode(bytes.slice(0, Math.min(bytes.length, 8192)));
    return text.includes("eXIf") || text.includes("Exif");
  }

  return false;
}

type ElaResult = {
  score: number;
  imageDataUrl: string;
  meanDiff: number;
};

async function runErrorLevelAnalysis(
  img: HTMLImageElement,
  maxDim = 512
): Promise<ElaResult> {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, 0, 0, w, h);
  const original = ctx.getImageData(0, 0, w, h);

  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.75);
  const recompressed = await loadImageFromDataUrl(jpegDataUrl);

  const reCanvas = document.createElement("canvas");
  reCanvas.width = w;
  reCanvas.height = h;
  const reCtx = reCanvas.getContext("2d", { willReadFrequently: true });
  if (!reCtx) throw new Error("Canvas not supported");
  reCtx.drawImage(recompressed, 0, 0, w, h);
  const reData = reCtx.getImageData(0, 0, w, h);

  const ela = ctx.createImageData(w, h);
  const amp = 18;
  let sum = 0;
  let sumSq = 0;
  const pixelCount = w * h;

  for (let i = 0; i < original.data.length; i += 4) {
    const dr = Math.abs(original.data[i] - reData.data[i]);
    const dg = Math.abs(original.data[i + 1] - reData.data[i + 1]);
    const db = Math.abs(original.data[i + 2] - reData.data[i + 2]);
    const diff = (dr + dg + db) / 3;
    sum += diff;
    sumSq += diff * diff;

    const v = clamp(Math.round(diff * amp), 0, 255);
    // Heatmap: cool (low diff) → warm (high diff)
    ela.data[i] = clamp(v * 2, 0, 255);
    ela.data[i + 1] = clamp(Math.round(v * 0.4), 0, 255);
    ela.data[i + 2] = clamp(255 - v, 0, 255);
    ela.data[i + 3] = 255;
  }

  ctx.putImageData(ela, 0, 0);
  const meanDiff = sum / pixelCount;
  const variance = sumSq / pixelCount - meanDiff * meanDiff;
  const std = Math.sqrt(Math.max(0, variance));

  // Higher localized variance → more suspicious edits; uniform low diff → consistent.
  // Map to authenticity-friendly score: high std of differences lowers authenticity.
  const suspicion = clamp((std - 1.5) * 12 + meanDiff * 2, 0, 100);
  const score = clamp(Math.round(100 - suspicion), 0, 100);

  return {
    score,
    imageDataUrl: canvas.toDataURL("image/png"),
    meanDiff,
  };
}

type NoiseResult = {
  noiseScore: number;
  smoothnessScore: number;
};

function analyzeNoiseAndSmoothness(img: HTMLImageElement, maxDim = 256): NoiseResult {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const gray = new Float32Array(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // Local 3x3 variance as noise proxy
  let varianceSum = 0;
  let blocks = 0;
  let edgeSum = 0;
  let edgeCount = 0;

  for (let y = 1; y < h - 1; y += 2) {
    for (let x = 1; x < w - 1; x += 2) {
      let mean = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          mean += gray[(y + dy) * w + (x + dx)];
        }
      }
      mean /= 9;
      let varAcc = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const d = gray[(y + dy) * w + (x + dx)] - mean;
          varAcc += d * d;
        }
      }
      varianceSum += varAcc / 9;
      blocks += 1;

      const gx = gray[y * w + (x + 1)] - gray[y * w + (x - 1)];
      const gy = gray[(y + 1) * w + x] - gray[(y - 1) * w + x];
      edgeSum += Math.abs(gx) + Math.abs(gy);
      edgeCount += 1;
    }
  }

  const avgVariance = blocks > 0 ? varianceSum / blocks : 0;
  const avgEdge = edgeCount > 0 ? edgeSum / edgeCount : 0;

  // Natural photos usually have moderate noise; very low variance → over-smooth (AI-like).
  // Very high chaotic noise can also look unnatural.
  const noiseNaturalness = clamp(100 - Math.abs(avgVariance - 18) * 2.5, 0, 100);
  const overSmoothPenalty = avgVariance < 4 ? clamp((4 - avgVariance) * 15, 0, 60) : 0;
  const smoothnessScore = clamp(Math.round(100 - overSmoothPenalty - (avgEdge < 8 ? 20 : 0)), 0, 100);
  const noiseScore = clamp(Math.round(noiseNaturalness), 0, 100);

  return { noiseScore, smoothnessScore };
}

/**
 * Client-side photo authenticity heuristics.
 * These are NOT proof of authenticity or manipulation — demos only.
 */
export async function analyzePhoto(file: File): Promise<PhotoAnalysis> {
  const buffer = await file.arrayBuffer();
  const fingerprint = await sha256Fingerprint(buffer);
  const hasExif = detectExif(buffer);
  const img = await loadImageFromFile(file);

  const ela = await runErrorLevelAnalysis(img);
  const { noiseScore, smoothnessScore } = analyzeNoiseAndSmoothness(img);

  const exifScore = hasExif ? 72 : 48;

  const signals: PhotoSignal[] = [
    {
      name: "Error Level Analysis (ELA)",
      score: ela.score,
      explanation: hasHighSuspicion(ela.score)
        ? "Recompression differences are uneven — possible local edits or mixed compression. Heuristic only."
        : "Error levels look relatively consistent across the image after JPEG recompression.",
    },
    {
      name: "Noise / texture",
      score: noiseScore,
      explanation:
        noiseScore < 45
          ? "Noise pattern looks unusual (too flat or chaotic) compared with typical camera photos."
          : "Local noise variance is within a plausible range for a natural photo.",
    },
    {
      name: "Smoothness",
      score: smoothnessScore,
      explanation:
        smoothnessScore < 50
          ? "Regions look over-smoothed — a weak signal sometimes seen in AI-generated imagery."
          : "Edge and texture detail do not scream over-smoothing.",
    },
    {
      name: "EXIF / metadata",
      score: exifScore,
      explanation: hasExif
        ? "EXIF/APP1 metadata detected. Presence is a weak positive signal — it can be stripped or forged."
        : "No EXIF found. Common for screenshots, social downloads, and edits — not proof of a fake.",
    },
  ];

  // Weighted authenticity: ELA + noise + smoothness primary; EXIF weak
  const authenticityScore = clamp(
    Math.round(
      ela.score * 0.35 +
        noiseScore * 0.25 +
        smoothnessScore * 0.25 +
        exifScore * 0.15
    ),
    0,
    100
  );

  return {
    authenticityScore,
    fingerprint,
    hasExif,
    elaScore: ela.score,
    noiseScore,
    smoothnessScore,
    signals,
    elaImageDataUrl: ela.imageDataUrl,
  };
}

function hasHighSuspicion(score: number): boolean {
  return score < 55;
}
