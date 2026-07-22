import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "MEETSPHERE_JWT_SECRET_2026";

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide username and password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            // Generate JWT token containing user id and username
            const token = jwt.sign(
                { id: user._id, username: user.username, name: user.name },
                JWT_SECRET,
                { expiresIn: "30d" }
            );

            // Update user token in DB (for tracking/compatibility)
            user.token = token;
            await user.save();

            return res.status(httpStatus.OK).json({
                token: token,
                user: {
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar || ""
                }
            });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" });
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

const register = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            avatar: ""
        });

        await newUser.save();
        return res.status(httpStatus.CREATED).json({ message: "User Registered Successfully" });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        return res.status(httpStatus.OK).json({ user });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

const updateProfile = async (req, res) => {
    const { name, password, avatar } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        return res.status(httpStatus.OK).json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                username: user.username,
                avatar: user.avatar
            }
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

const getUserHistory = async (req, res) => {
    try {
        // Find meetings where this user is the creator or a participant
        const meetings = await Meeting.find({
            $or: [
                { creator: req.user.id },
                { participants: req.user.username }
            ]
        }).sort({ date: -1 });

        return res.status(httpStatus.OK).json(meetings);
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

const addToHistory = async (req, res) => {
    const { meeting_code, meeting_name } = req.body;

    if (!meeting_code) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Meeting code is required" });
    }

    try {
        let meeting = await Meeting.findOne({ meetingCode: meeting_code, status: "active" });

        if (!meeting) {
            meeting = new Meeting({
                user_id: req.user.username,
                meetingCode: meeting_code,
                creator: req.user.id,
                creatorUsername: req.user.username,
                meetingName: meeting_name || `Meeting ${meeting_code}`,
                participants: [req.user.username],
                status: "active"
            });
        } else {
            if (!meeting.participants.includes(req.user.username)) {
                meeting.participants.push(req.user.username);
            }
        }

        await meeting.save();
        return res.status(httpStatus.CREATED).json({ message: "Added meeting to history", meeting });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

const scheduleMeeting = async (req, res) => {
    const { meeting_code, meeting_name, scheduled_at } = req.body;

    if (!meeting_code || !scheduled_at) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Meeting code and schedule time are required" });
    }

    try {
        const newMeeting = new Meeting({
            meetingCode: meeting_code,
            creator: req.user.id,
            creatorUsername: req.user.username,
            meetingName: meeting_name || `Scheduled Meeting ${meeting_code}`,
            scheduledAt: new Date(scheduled_at),
            status: "active",
            participants: []
        });

        await newMeeting.save();
        return res.status(httpStatus.CREATED).json({ message: "Meeting scheduled successfully", meeting: newMeeting });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

export { login, register, getUserHistory, addToHistory, getUserProfile, updateProfile, scheduleMeeting };