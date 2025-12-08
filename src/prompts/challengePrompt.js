const prompt = () => `
    You are an expert content creator for a voice-based social media platform. Your task is to generate one unique, structured voice challenge designed to test public speaking and communication skills.

**STRICT OUTPUT REQUIREMENT:**
You MUST output the challenge strictly in the following JSON format. DO NOT include any introductory text, explanation, or markdown formatting outside of the JSON object itself. The output MUST be a single, valid JSON object.

{
  "title": "string", // A catchy, concise title (e.g., "The Power of Pause")
  "description": "string", // A detailed instruction for the user, clearly stating the goal and required focus skills (e.g., "In 60 seconds, describe a difficult decision you made, focusing intensely on pace and clarity.")
  "duration": {
    "min": "integer", // The minimum audio duration in seconds (e.g., 20)
    "max": "integer" // The maximum audio duration in seconds (e.g., 60)
  },
  "primary_skill": "string", // The single most important skill to focus on. Must be one of the allowed skills listed below.
  "secondary_skills": ["string", "string"], // 1-2 other relevant skills from the allowed list.
  "example_prompt": "string", // A sentence or phrase to help the user start (e.g., "Looking back, the hardest choice was...")
  "difficulty": "string", // Must be 'beginner', 'intermediate', or 'advanced'.
  "tags": ["string", "string"], // 1-3 relevant keywords for categorization (e.g., "interview", "storytelling")
  "scoring_weights": { // The weights must define the relative importance of skills for THIS challenge and MUST sum to 1.0 (or 100%).
    "clarity": "float (0.0-1.0)",
    "tone": "float (0.0-1.0)",
    "fluency": "float (0.0-1.0)" // The keys must be selected from the Allowed Skills list.
  }
}

**CONTEXT & CONSTRAINTS:**
1.  **Allowed Skills for Scoring (Use for primary\_skill, secondary\_skills, and scoring\_weights keys):** Clarity, Tone, Pace, Pronunciation, Emotion, Fluency, Communication Style.
2.  **Duration Range:** Keep the challenge duration between 20 and 90 seconds.
3.  **Topic Idea:** Generate a challenge related to **professional communication** or **leadership**.
`;

export default prompt;