import express from "express";
import { getChallenge, getAllChallenge, generateAndStoreChallenge } from "../controllers/challenge.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router();

// Public route protected by Secret Key (for Cron Jobs)
router.post('/trigger', async (req, res) => {
    try {
        const secret = req.headers['x-cron-secret'];
        if (secret !== process.env.CRON_SECRET) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid Cron Secret" });
        }

        const result = await generateAndStoreChallenge();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.use(verifyJWT);

router.get('/get-challenge/', getChallenge);
router.get('/get-all-challenges', getAllChallenge);

export default router;