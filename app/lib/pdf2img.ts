// app/lib/pdf2img.ts

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjs: any = null;

async function loadPdfJs() {
  if (pdfjs) return pdfjs;

  // Correct working import for Vite + pdfjs-dist
  const pdf = await import("pdfjs-dist/build/pdf");
  const worker = await import("pdfjs-dist/build/pdf.worker");

  pdf.GlobalWorkerOptions.workerSrc = worker;

  pdfjs = pdf;

  return pdfjs;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
  try {
    const pdfjsLib = await loadPdfJs();

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          resolve({ imageUrl: "", file: null, error: "Failed to create PNG" });
          return;
        }

        const pngFile = new File([blob], file.name.replace(".pdf", ".png"), {
          type: "image/png",
        });

        resolve({
          imageUrl: URL.createObjectURL(blob),
          file: pngFile,
        });
      });
    });
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: `PDF conversion failed: ${err}`,
    };
  }
}
