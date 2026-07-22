import mongoose from "mongoose";
import { Schema } from "mongoose";

const userScheme = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        token: { type: String },
        avatar: { type: String, default: "" } // Stores Base64 encoded image or predefined path
    }
);

const User = mongoose.model("User", userScheme);

export { User };