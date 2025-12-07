import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
    // Primary link to the Submission document
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true,
        unique: true // Ensures one metadata document per submission
    },

    // Core Links and Location
    audio_url: { // The public or private URL from ImageKit/S3 [cite: 237]
        type: String,
        required: true
    },

    // Extracted Metadata (from ImageKit or custom library)
    duration_sec: { // Actual duration of the audio in seconds
        type: Number,
        required: true,
        min: 0
    },
    file_size_bytes: { // Size of the file for storage tracking
        type: Number,
        required: true,
        min: 1
    },
    file_format: { // Supported formats: .mp3, .wav, .m4a [cite: 97, 98, 99]
        type: String,
        enum: ['.mp3', '.wav', '.m4a'],
        required: true
    },
    sample_rate: { // Important for the Python AI Service processing [cite: 108]
        type: Number,
        required: false
    },

    // Validation Status
    is_valid_duration: { // Result of checking duration against Challenge limits
        type: Boolean,
        default: false
    },

    // Processing Status
    processing_attempts: { // Count of retries for failed tasks (Reliability NFR) [cite: 182]
        type: Number,
        default: 0
    },
    last_processed_at: {
        type: Date,
        required: false
    }
}, {
    timestamps: true // Tracks when metadata was recorded/updated
});

const Audio = mongoose.model('Audio', audioSchema);

export default Audio;