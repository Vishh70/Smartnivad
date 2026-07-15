import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

// Ensure cloudinary is configured (needs CLOUDINARY_URL or CLOUDINARY_API_KEY etc in env)
// Cloudinary configures itself automatically from CLOUDINARY_URL if present.

export async function processAndUploadImage(imageUrl: string): Promise<string> {
  // 1. Download
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download image from ${imageUrl}: ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2. Validate & Resize
  // Instagram ratio requirements: 4:5 (0.8) to 1.91:1 (1.91)
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 1080;
  const height = metadata.height || 1080;
  const ratio = width / height;

  let imagePipeline = sharp(buffer);

  if (ratio < 0.8) {
    // Too tall, crop to 4:5
    imagePipeline = imagePipeline.resize({
      width,
      height: Math.floor(width / 0.8),
      fit: "cover",
    });
  } else if (ratio > 1.91) {
    // Too wide, crop to 1.91:1
    imagePipeline = imagePipeline.resize({
      width: Math.floor(height * 1.91),
      height,
      fit: "cover",
    });
  }

  // Convert to JPEG, compress (< 8MB recommended, quality 85 is usually < 1MB)
  const optimizedBuffer = await imagePipeline
    .jpeg({ quality: 85, chromaSubsampling: "4:4:4" })
    .toBuffer();

  // 3. Upload
  // Check if cloudinary is configured
  if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_API_KEY) {
    console.warn(
      "[Instagram Image] Cloudinary is not configured. Falling back to original URL.",
    );
    return imageUrl; // Fallback to original URL if we can't upload
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "smartnivad_social_optimized" },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Unknown Cloudinary error"));
        }
      },
    );
    uploadStream.end(optimizedBuffer);
  });
}
