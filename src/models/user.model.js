import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,//cloudinary service url
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
}, {
    timestamps: true
})


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return; // Skip if unchanged
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (err) {
        console.log(err);
    }
})

userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
}

export const User = mongoose.model("User", userSchema);