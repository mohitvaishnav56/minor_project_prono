import mongoose from "mongoose";

function connectDB() {

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        process.exit(1);
    }
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
            process.exit(1);
        });
}

export default connectDB;