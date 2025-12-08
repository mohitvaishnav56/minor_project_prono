import express from "express";
import { getChallenge, getAllChallenge } from "../controllers/challenge.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
 
const router = express.Router();

router.use(verifyJWT);

router.get('/get-challenge/:id', getChallenge);
router.get('/getAll-challenge', getAllChallenge);

export default router;