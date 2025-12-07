import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    refreshAccess_Token,
    updateProfile
} from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage()
})

import {
    verifyJWT,
    refreshToken,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("avatar"),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").get(refreshToken, refreshAccess_Token);
router.route("/update-profile").put(
    verifyJWT,
    upload.single("avatar"),
    updateProfile);

export default router;
