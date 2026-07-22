import { Router } from "express";
import {
    addToHistory,
    getUserHistory,
    login,
    register,
    getUserProfile,
    updateProfile,
    scheduleMeeting
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);

// Protected REST routes
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/update_profile").put(verifyJWT, updateProfile);
router.route("/add_to_activity").post(verifyJWT, addToHistory);
router.route("/get_all_activity").get(verifyJWT, getUserHistory);
router.route("/schedule_meeting").post(verifyJWT, scheduleMeeting);

export default router;