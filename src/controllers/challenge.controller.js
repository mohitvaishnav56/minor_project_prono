// Install: npm install node-cron
import cron from "node-cron";
import { generateChallenge } from "../services/ai.service.js";
import { fetchUsersToNotify } from "../services/fetchUsersToNotify.service.js";
import email from "../services/email.service.js"
import Challenge from "../models/challenge.model.js";
import { ApiError } from '../utils/ApiError.js';


const TWICE_DAILY_SCHEDULE = '26 15,21 * * *';

const startChallengeScheduler = () => {
    // This will run approximately at 9:00 AM and 9:00 PM (or 12 hours apart from server start time) 
    cron.schedule(TWICE_DAILY_SCHEDULE, async () => {
        console.log('🤖 Running TWICE DAILY AI challenge generation...');

        try {
            const challengeData = await generateChallenge();

            if (challengeData) {
                // 1. Save to Database
                const now = new Date();

                // Handle duration mapping if it comes as an object
                let durationMin = challengeData.duration_min;
                let durationMax = challengeData.duration_max;

                if (challengeData.duration && typeof challengeData.duration === 'object') {
                    durationMin = challengeData.duration.min;
                    durationMax = challengeData.duration.max;
                }

                const newChallenge = new Challenge({
                    ...challengeData,
                    duration_min: durationMin,
                    duration_max: durationMax,
                    challengeId: `CHLG-${now.toISOString().split('T')[0].replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
                    scheduled_at: now,
                    status: 'pending' // As per requirement, admin might need to approve? Or set published?
                    // User asked for "date of challenge hosting or publishion", so setting these.
                });

                const savedChallenge = await newChallenge.save();
                console.log('✅ Challenge successfully generated and saved:', savedChallenge._id);

                // 2. Fetch Users to Notify
                const userEmails = await fetchUsersToNotify();

                if (userEmails.length > 0) {
                    // 3. Send Email
                    await email(
                        userEmails,
                        savedChallenge.title,
                        savedChallenge.description,
                        savedChallenge.scheduled_at.toDateString(),
                        // Assuming frontend link structure, adjust as needed
                        `https://your-app-url.com/challenges/${savedChallenge.challengeId}`
                    );
                    console.log(`📧 Email notifications sent to ${userEmails.length} users.`);
                } else {
                    console.log('ℹ️ No users opted in for notifications.');
                }

            } else {
                console.error('❌ Challenge generation failed (fetched null).');
            }
        } catch (error) {
            if (error instanceof ApiError) {
                console.error(`❌ ApiError [${error.statusCode}]: ${error.message}`);
                if (error.errors && error.errors.length > 0) {
                    console.error('   Details:', error.errors);
                }
            } else {
                console.error('❌ Unexpected Error during challenge generation/storage/email:', error);
            }
        }
    });

    console.log(`Challenge scheduler initialized. Runs are scheduled every 12 hours (e.g., 9:00 AM and 9:00 PM) in Asia/Kolkata timezone.`);
};

// Export the start function
export { startChallengeScheduler };