// Install: npm install node-cron
import cron from "node-cron";
import { generateChallenge } from "../services/ai.service.js";
import {fetchUsersToNotify} from "../services/fetchUsersToNotify.service.js";
import email from "../services/email.service.js"


const TWICE_DAILY_SCHEDULE = '* * * * *'; 

const startChallengeScheduler = () => {
    // This will run approximately at 9:00 AM and 9:00 PM (or 12 hours apart from server start time) 
    cron.schedule(TWICE_DAILY_SCHEDULE, async () => {
        console.log('🤖 Running TWICE DAILY AI challenge generation...');
        
        try {
            const challengeData = await generateChallenge();
            const users = await fetchUsersToNotify();
            email(users);
            console.log('✅ Challenge successfully generated and saved.');
        } catch (error) {
            console.error('❌ Error during challenge generation:', error);
        }
    });
    
    console.log(`Challenge scheduler initialized. Runs are scheduled every 12 hours (e.g., 9:00 AM and 9:00 PM) in Asia/Kolkata timezone.`);
};

// Export the start function
export { startChallengeScheduler };