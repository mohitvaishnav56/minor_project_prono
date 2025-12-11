// services/mockAiScorer.service.js
/**
 * Mock AI scorer — returns random but plausible scores
 * Simulates async processing delay (2-4s)
 */
export const mockScoreAudio = async (submission) => {
  // Simulate processing time
  await new Promise((r) => setTimeout(r, 2000 + Math.floor(Math.random() * 2000)));

  // Dummy scoring (0-100)
  const clarity = 70 + Math.floor(Math.random() * 25);
  const tone = 65 + Math.floor(Math.random() * 30);
  const fluency = 68 + Math.floor(Math.random() * 25);
  const emotion = 60 + Math.floor(Math.random() * 35);
  const speed = 1.0 + Math.random() * 0.8; // e.g. words/sec (mock)
  const noise = Math.floor(Math.random() * 20);
  const overall_ai_score = Math.round((clarity * 0.4) + (tone * 0.3) + (fluency * 0.3));

  const feedback = "Good clarity and fluency. Work on expressiveness and reduce background noise.";

  return {
    clarity, tone, fluency, emotion, speed, noise, overall_ai_score, feedback
  };
};

export default mockScoreAudio;
