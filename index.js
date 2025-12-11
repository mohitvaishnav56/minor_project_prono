import "dotenv/config.js";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";

// import { startChallengeScheduler } from "./src/controllers/challenge.controller.js";

connectDB();
// startChallengeScheduler(); // Disabled in favor of external cron trigger via /api/v1/challenge/trigger

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});