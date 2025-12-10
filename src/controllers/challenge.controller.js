// Install: npm install node-cron
import cron from "node-cron";
import { generateChallenge } from "../services/ai.service.js";
import { fetchUsersToNotify } from "../services/fetchUsersToNotify.service.js";
import email from "../services/email.service.js";
import Challenge from "../models/challenge.model.js";
import { ApiError } from "../utils/ApiError.js";
import { messageContentToJSON } from "@openrouter/sdk/models";


const TWICE_DAILY_SCHEDULE = '0 9,18,20 * * *';

// Function to generate and store challenge - decoupled from cron
const generateAndStoreChallenge = async () => {
  console.log("🤖 Running AI challenge generation (Manual/Scheduled)...");

  try {
    const challengeData = await generateChallenge();

    if (!challengeData) {
      console.error("❌ Challenge generation failed (fetched null).");
      return { success: false, message: "Challenge generation failed (fetched null)." };
    }

    const now = new Date();

    // Normalize duration (supports both flat & object structures)
    let { duration_min, duration_max, duration } = challengeData;

    if (!duration_min || !duration_max) {
      if (duration && typeof duration === "object") {
        duration_min = duration.min;
        duration_max = duration.max;
      }
    }

    const newChallenge = new Challenge({
      ...challengeData,
      duration_min,
      duration_max,
      challengeId: `CHLG-${now
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "")}-${Date.now().toString().slice(-4)}`,
      scheduled_at: now,
      status: "pending",
    });

    const savedChallenge = await newChallenge.save();
    console.log(
      "✅ Challenge successfully generated and saved:",
      savedChallenge._id
    );

    const userEmails = await fetchUsersToNotify();

    if (Array.isArray(userEmails) && userEmails.length > 0) {
      await email(
        userEmails,
        savedChallenge.title,
        savedChallenge.description,
        savedChallenge.scheduled_at.toDateString(),
        `https://your-app-url.com/challenges/${savedChallenge.challengeId}`
      );

      console.log(
        `📧 Email notifications sent to ${userEmails.length} users.`
      );
    } else {
      console.log("ℹ️ No users opted in for notifications.");
    }

    return { success: true, message: "Challenge generated and emails sent.", challengeId: savedChallenge.challengeId };

  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`❌ ApiError [${error.statusCode}]: ${error.message}`);
      if (error.errors?.length) {
        console.error("   Details:", error.errors);
      }
    } else {
      console.error(
        "❌ Unexpected Error during challenge generation/storage/email:",
        error
      );
    }
    throw error; // Re-throw so the caller knows it failed
  }
};

const startChallengeScheduler = () => {
  // Runs based on cron expression, now correctly in Asia/Kolkata timezone
  cron.schedule(
    TWICE_DAILY_SCHEDULE,
    async () => {
      await generateAndStoreChallenge();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log(
    "Challenge scheduler initialized. Runs are scheduled every 12 hours (e.g., 9:30 AM and 9:30 PM) in Asia/Kolkata timezone."
  );
};

// --------------------------------------------------------
//  Two schedules: 09:00–17:00 and 17:00–09:00 (next day)
//  Always returns ONLY ONE challenge in the active window
// --------------------------------------------------------

const getChallenge = async (req, res) => {
  try {
    const now = new Date();

    // Base "today" at midnight
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const windowStart = new Date(today);
    const windowEnd = new Date(today);

    const hour = now.getHours();

    // 🔹 Day shift → today 09:00–17:00
    if (hour >= 9 && hour < 18) {
      windowStart.setHours(9, 0, 0, 0);
      windowEnd.setHours(18, 0, 0, 0);

      // 🔹 Night shift (today 17:00 → tomorrow 09:00)
    } else if (hour >= 18) {
      windowStart.setHours(18, 0, 0, 0);
      windowEnd.setDate(windowEnd.getDate() + 1);
      windowEnd.setHours(9, 0, 0, 0);

      // 🔹 Night shift (yesterday 17:00 → today 09:00)
    } else {
      windowStart.setDate(windowStart.getDate() - 1);
      windowStart.setHours(18, 0, 0, 0);
      windowEnd.setHours(9, 0, 0, 0);
    }

    const challenge = await Challenge.findOne({
      scheduled_at: {
        $gte: windowStart,
        $lt: windowEnd,
      },
    })
      .sort({ scheduled_at: 1 }) // earliest in window if somehow multiple
      .lean(); // small optimization, returns plain JS object

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "No challenge found for current schedule window",
      });
    }

    return res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error("getChallenge error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllChallenge = async (req, res) => {
  try {
    const challenges = await Challenge.find();

    return res.status(200).json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export { startChallengeScheduler, getChallenge, getAllChallenge, generateAndStoreChallenge };
