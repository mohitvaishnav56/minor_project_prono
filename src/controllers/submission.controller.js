// controllers/submission.controller.js
import Submission from "../models/submission.model.js";
import { uploadAudioToImageKit } from "../services/imagkit.service.js";
import { v4 as uuidv4 } from "uuid";
import mockScoreAudio from "../services/mockAiScorer.service.js";
import { extractUploadedFile } from "../middlewares/multer.middleware.js";

/**
 * Upload audio endpoint handler
 * - Expects multipart/form-data with field "file"
 * - Fields: challengeId, userId (string)
 */
export const uploadAudio = async (req, res) => {
  try {
    const file = extractUploadedFile(req);
    if (!file)
      return res
        .status(400)
        .json({
          success: false,
          message:
            "No audio file provided. Use field name 'file' or 'audio' or 'upload'.",
        });
    const userId = req.user._id;
    const { challengeId, duration_sec } = req.body;

    if (!file)
      return res
        .status(400)
        .json({
          success: false,
          message: "No audio file provided (field 'file')",
        });
    if (!challengeId || !userId)
      return res
        .status(400)
        .json({ success: false, message: "Provide challengeId and userId" });

    const filename = `${userId}_${Date.now()}_${file.originalname}`;

    // upload to ImageKit
    const uploadResp = await uploadAudioToImageKit(
      file.buffer,
      filename,
      "/audio-submissions"
    );

    // create submission record
    const submissionId = `SUB-${Date.now().toString().slice(-6)}-${uuidv4().slice(0, 6)}`;
    const newSubmission = new Submission({
      submissionId,
      challengeId,
      userId,
      audio_url: uploadResp.url,
      audio_file_id: uploadResp.fileId,
      duration_sec: duration_sec ? Number(duration_sec) : undefined,
      format: file.mimetype,
      status: "uploaded",
    });

    const saved = await newSubmission.save();

    return res.status(201).json({
      success: true,
      message: "Uploaded and saved submission metadata",
      data: {
        submissionId: saved.submissionId,
        audio_url: saved.audio_url,
        id: saved._id,
      },
    });
  } catch (err) {
    console.error("uploadAudio error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Upload failed" });
  }
};

/**
 * Trigger processing (submit for scoring). This would normally push to a queue.
 * For now we run mock scorer and update doc (fire-and-forget).
 */
export const submitForScoring = async (req, res) => {
  try {
    const idOrSubmissionId = req.params.id;
    const submission = await Submission.findOne({
      $or: [{ _id: idOrSubmissionId }, { submissionId: idOrSubmissionId }],
    });

    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    if (submission.status === "processing") {
      return res
        .status(409)
        .json({ success: false, message: "Submission already processing" });
    }

    // Update -> processing
    submission.status = "processing";
    await submission.save();

    // Fire-and-forget: process in background
    (async () => {
      try {
        const aiResult = await mockScoreAudio(submission);
        submission.ai_scores = aiResult;
        submission.final_score = aiResult.overall_ai_score; // temp
        submission.status = "done";
        await submission.save();
        console.log("Submission scored:", submission.submissionId);
      } catch (err) {
        console.error("Background scoring failed:", err);
        submission.status = "failed";
        await submission.save();
      }
    })();

    return res
      .status(202)
      .json({
        success: true,
        message: "Scoring started (background). Check status endpoint.",
        submissionId: submission.submissionId,
      });
  } catch (err) {
    console.error("submitForScoring error:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to start scoring",
      });
  }
};

export const getSubmission = async (req, res) => {
  try {
    const idOrSubmissionId = req.params.id;
    const submission = await Submission.findOne({
      $or: [{ _id: idOrSubmissionId }, { submissionId: idOrSubmissionId }],
    }).lean();

    if (!submission)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.json({ success: true, data: submission });
  } catch (err) {
    console.error("getSubmission error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Error" });
  }
};

export const listSubmissionsForChallenge = async (req, res) => {
  try {
    const challengeId = req.params.challengeId;
    const list = await Submission.find({ challengeId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, data: list });
  } catch (err) {
    console.error("listSubmissionsForChallenge error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Error" });
  }
};
