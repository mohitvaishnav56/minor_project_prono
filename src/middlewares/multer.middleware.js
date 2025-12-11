// middlewares/multerAudio.middleware.js (replace existing)
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only audio files are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Accept any of these field names (one file)
export const uploadAudioFlexible = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "audio", maxCount: 1 },
  { name: "upload", maxCount: 1 }
]);

// Helper to extract the single file in controller
export const extractUploadedFile = (req) => {
  if (!req.files) return null;
  if (req.files.file && req.files.file[0]) return req.files.file[0];
  if (req.files.audio && req.files.audio[0]) return req.files.audio[0];
  if (req.files.upload && req.files.upload[0]) return req.files.upload[0];
  return null;
};