import mongoose from 'mongoose';

// Define the schema for the scoring weights object
const ScoringWeightsSchema = new mongoose.Schema({
    // Using a Map for dynamic keys like 'clarity', 'tone', 'fluency' 
    // This allows the keys to be flexible based on the challenge focus
    clarity: { type: Number, required: true },
    tone: { type: Number, required: false }, // Optional, based on challenge
    pace: { type: Number, required: false }, 
    pronunciation: { type: Number, required: false },
    emotion: { type: Number, required: false },
    // You can add other potential scoring keys here...
}, { _id: false }); // Do not create a separate ID for this subdocument

// 1. Define the main Challenge Schema
const ChallengeSchema = new mongoose.Schema({
    // Challenge ID is typically the MongoDB ObjectId, but we add a custom slug/ID field for external use
    challengeId: {
        type: String,
        required: true,
        unique: true,
        // Could be generated upon creation (e.g., 'CHLG-20251207-001')
    },
    
    // Core AI-Generated Fields
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    example_prompt: { 
        type: String, 
        required: true 
    },
    difficulty: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced'], // Example enum for control
        required: true 
    },
    tags: { 
        type: [String], 
        required: true 
    },
    primary_skill: { 
        type: String, 
        required: true 
    },
    secondary_skills: { 
        type: [String], 
        required: false 
    },

    // Duration Constraints
    duration_min: { 
        type: Number, 
        required: true,
        min: 0 
    },
    duration_max: { 
        type: Number, 
        required: true,
        min: 1
    },

    // Scoring Configuration
    scoring_weights: { 
        type: ScoringWeightsSchema, 
        required: true 
    },

    // Admin & Status Fields
    created_by_ai: { 
        type: Boolean, 
        default: true 
    }, // Default to true as core USP is AI generation [cite: 59]
    approved: { 
        type: Boolean, 
        default: false 
    }, // Requires Admin approval before publishing [cite: 87]
    status: {
        type: String,
        enum: ['pending', 'published', 'archived', 'rejected'],
        default: 'pending' // Initial status before Admin action [cite: 231]
    }
}, {
    timestamps: true // Adds standard 'createdAt' and 'updatedAt' fields
});

// 2. Create and Export the Mongoose Model
const Challenge = mongoose.model('Challenge', ChallengeSchema);

export default Challenge;