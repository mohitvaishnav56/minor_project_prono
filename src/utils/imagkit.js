import "dotenv/config";
import ImageKit from "imagekit";

if (
  !process.env.IMAGEKIT_PUBLIC_KEY ||
  !process.env.IMAGEKIT_PRIVATE_KEY ||
  !process.env.IMAGEKIT_URL_ENDPOINT
) {
  console.error("IMAGEKIT ENV DEBUG:", {
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY ? "***hidden***" : undefined,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  throw new Error("Missing ImageKit credentials");
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
