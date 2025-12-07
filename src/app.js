import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//ur encoding ke liye use kiya jaata hai eg: space -> %20 or something
app.use(express.static("public"));

import userRouter from "./routes/user.routes.js"


app.use("/api/v1/users", userRouter);

export default app;