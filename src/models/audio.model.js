import mongoose, { Schema } from "mongoose";

const audioSchema = new Schema({
    audioFile: {
        type: String,//url
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},{
    timestamps: true
})

export const Audio = mongoose.model("Audio", audioSchema);