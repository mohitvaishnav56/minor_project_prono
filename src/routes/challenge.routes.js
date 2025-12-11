import express from "express";
import { getChallenge, getAllChallenge, generateAndStoreChallenge } from "../controllers/challenge.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router();

// Public route protected by Secret Key (for Cron Jobs)
router.post('/trigger', (req, res) => {
    try {
        const secret = req.headers['x-cron-secret'];
        if (secret !== process.env.CRON_SECRET) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid Cron Secret" });
        }

        generateAndStoreChallenge()
            .then(result => console.log("Background Trigger Success:", result))
            .catch(err => console.error("Background Trigger Failed:", err));

        // Return success immediately to satisfied the cron service
        return res.status(202).json({
            success: true,
            message: "Trigger received. Challenge generation started in background."
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.use(verifyJWT);

router.get('/get-challenge', getChallenge);
router.get('/get-all-challenges', getAllChallenge);

export default router;