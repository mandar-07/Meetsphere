import { Schema } from "mongoose";
import mongoose from "mongoose";

const meetingSchema = new Schema(
    {
        user_id: { type: String }, // Retained for backwards compatibility
        meetingCode: { type: String, required: true },
        creator: { type: Schema.Types.ObjectId, ref: 'User' },
        creatorUsername: { type: String },
        participants: [{ type: String }], // List of usernames who joined
        date: { type: Date, default: Date.now, required: true },
        duration: { type: Number, default: 0 }, // in minutes
        meetingName: { type: String, default: "Quick Meeting" },
        status: { type: String, enum: ["active", "completed"], default: "active" },
        scheduledAt: { type: Date } // Used if the meeting was scheduled
    }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };