import ImageKit from "imagekit";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const PDF_MIMES = ["application/pdf"];
const DOC_MIMES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
];

export async function uploadFile({ buffer, filename, mimetype }) {
  if (!buffer) throw new Error("Missing file buffer");

  let finalBuffer = buffer;
  let finalName = filename || `file-${Date.now()}`;

  // Convert AVIF to JPEG
  if (mimetype === "image/avif") {
    finalBuffer = await sharp(buffer).jpeg({ quality: 85 }).toBuffer();
    finalName = filename.replace(/\.\w+$/, ".jpg");
    mimetype = "image/jpeg";
  }

  // Optimize images
  if (IMAGE_MIMES.includes(mimetype)) {
    const metadata = await sharp(finalBuffer).metadata();
    if (metadata.width > 2048 || metadata.height > 2048) {
      finalBuffer = await sharp(finalBuffer)
        .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      if (!finalName.match(/\.(jpg|jpeg)$/i)) {
        finalName = finalName.replace(/\.\w+$/, ".jpg");
      }
    }
  }

  const base64File = finalBuffer.toString("base64");
  const folder = PDF_MIMES.includes(mimetype)
    ? "/chat-pdfs"
    : DOC_MIMES.includes(mimetype)
    ? "/chat-docs"
    : "/chat-images";

  try {
    const res = await imagekit.upload({
      file: base64File,
      fileName: finalName,
      folder,
      useUniqueFileName: true,
    });
    return { url: res.url, fileId: res.fileId, name: finalName };
  } catch (err) {
    console.error("ImageKit upload error:", err.message);
    throw new Error("File upload failed");
  }
}