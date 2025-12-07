import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import { verifyAccessToken, verifyRefreshToken }  from "../utils/jwt.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new ApiError(401, "Unauthorized access"); 

        const decodedTokenInfo = verifyAccessToken(token);

        const user = await User.findById(decodedTokenInfo?.userId);
        if (!user) throw new ApiError(401, "Invalid Access Token");

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid AccessToken")
    }
})

export const refreshToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.header("x-refresh-token");
        if (!token) throw new ApiError(401, "Unauthorized access");

        const decodedTokenInfo = verifyRefreshToken(token);

        const user = await User.findById(decodedTokenInfo?.userId);
        if (!user) throw new ApiError(401, "Invalid Refresh Token");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
})   
