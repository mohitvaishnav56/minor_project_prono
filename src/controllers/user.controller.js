import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { access_Token, refresh_Token } from "../utils/jwt.js";
import { uploadOnImageKit, deleteFromImageKit } from "../services/imagkit.service.js"


const options = {
    httpOnly: true,
    secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
    //get credentials
    const { userName, email, fullName, password } = req.body;

    if (
        [fullName, userName, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All Fields are required");
    }

    //check if user already exist using userName and email
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (existedUser) throw new ApiError(409, "user already exists");

    const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        password,
        userName: userName.toLowerCase(),
    });

    const accessToken = access_Token({ userId: user._id });
    const refreshToken = refresh_Token({ userId: user._id });

    if (!user)
        throw new ApiError(
            500,
            "something went wrong while registering a user"
        );
    //send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "user registered successfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    if ([userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }
    const user = await User.findOne({ userName: userName });
    if (!user) throw new ApiError(404, "user not found");
    //check for password correctness
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new ApiError(401, "invalid credentials");
    //return res : error
    const accessToken = access_Token({ userId: user._id });
    const refreshToken = refresh_Token({ userId: user._id });
    await user.save();
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "user login successfully"
            )
        );
});

const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) throw new ApiError(404, "user not found");
    return res
        .status(200)
        .json(new ApiResponse(200, user, "user profile fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, { message: "user logged out successfully" })
        );
});

const refreshAccess_Token = asyncHandler(async (req, res) => {
    const user = req.user;
    const newAccessToken = access_Token({ userId: user._id });
    const newRefreshToken = refresh_Token({ userId: user._id });
    return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken: newAccessToken, refreshToken: newRefreshToken },
                "access token refreshed successfully"
            )
        );
});

const updateProfile = asyncHandler(async (req, res) => {
    const { user, body } = req;

    // 1. Initialize 'url' to undefined or the existing user's avatar
    let avatarUrl = undefined;

    // 2. Check if a new file was uploaded
    if (req.file) {
        // Assuming uploadOnImageKit returns an object with a 'url' property
        const avatar = await uploadOnImageKit(req.file);
        avatarUrl = avatar.url; // Assign the value to the variable defined outside the block
    }

    // 3. Build the update object dynamically
    const updateFields = {
        userName: body.userName,
    };

    // Only add the 'avatar' field to the update if a new URL was generated
    if (avatarUrl) {
        updateFields.avatar = avatarUrl;
    }

    // 4. Perform the update
    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id }, // Use object for query if user is populated
        { $set: updateFields },
        { new: true, runValidators: true } // Options for returning the new document and running schema validators
    ).select("-password");

    // 5. Send a response back to the client
    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
    });
});


export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    refreshAccess_Token,
    updateProfile
};