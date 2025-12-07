import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    refreshAccess_Token,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    verifyJWT,
    refreshToken,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
        },
    ]),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").get(refreshToken, refreshAccess_Token);

export default router;
