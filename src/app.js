import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import { startChallengeScheduler } from "./controllers/challenge.controller.js"
import submissionRoutes from "./routes/submission.route.js";
// import {fetchUsersToNotify} from "./services/fetchUsersToNotify.service.js"

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//ur encoding ke liye use kiya jaata hai eg: space -> %20 or something
app.use(express.static("public"));

startChallengeScheduler();
// fetchUsersToNotify()

import userRouter from "./routes/user.routes.js"
import challengeRouter from "./routes/challenge.routes.js"


app.use("/api/v1/users", userRouter);
app.use("/api/v1/challenge", challengeRouter)
app.use("/api/v1/submissions", submissionRoutes);


export default app;