import express from "express";
import { getChallenge, getAllChallenge } from "../controllers/challenge.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
 
const router = express.Router();

router.use(verifyJWT);

router.get('/get-challenge/', getChallenge);
router.get('/get-all-challenges', getAllChallenge);

export default router;