// models/submission.model.js
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  submissionId: { type: String, required: true, unique: true },
  challengeId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  audio_url: { type: String, required: true },
  audio_file_id: { type: String }, // ImageKit fileId
  duration_sec: { type: Number },
  format: { type: String },
  status: { type: String, enum: ["uploaded", "processing", "done", "failed"], default: "uploaded" },
  ai_scores: {
    clarity: Number,
    tone: Number,
    fluency: Number,
    emotion: Number,
    speed: Number,
    noise: Number,
    overall_ai_score: Number,
    feedback: String,
  },
  community_scores: [{ userId: mongoose.Schema.Types.ObjectId, ratings: Object }],
  final_score: Number,
  createdAt: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", SubmissionSchema);
export default Submission;
