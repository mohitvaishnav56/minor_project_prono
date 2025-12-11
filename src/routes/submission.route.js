// routes/submission.routes.js
import express from "express";
import { uploadAudioFlexible } from "../middlewares/multer.middleware.js";
import {
  uploadAudio,
  submitForScoring,
  getSubmission,
  listSubmissionsForChallenge
} from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.use(verifyJWT);

// Upload audio file (multipart/form-data)
// Fields: file (audio), challengeId (string), userId (string), duration_sec (optional)
router.post("/upload", uploadAudioFlexible, uploadAudio);

// Trigger scoring (background)
router.post("/:id/submit", submitForScoring);

// Get submission status/data
router.get("/:id", getSubmission);

// List challenge submissions
router.get("/challenge/:challengeId", listSubmissionsForChallenge);

export default router;