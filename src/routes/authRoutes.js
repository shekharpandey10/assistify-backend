import express from "express";
import { registerUser, loginUser, getProfile ,makeAdmin} from "../controllers/authController.js";
import {protect} from '../middlewares/authMiddleware.js'
import { adminAuth } from "../middlewares/admin.js";


const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private route (requires token)
router.get("/profile",protect, getProfile);
router.patch("/make-admin/:userId", protect, adminAuth, makeAdmin);

export default router;
