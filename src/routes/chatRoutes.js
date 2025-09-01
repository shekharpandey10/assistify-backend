// backend/src/routes/chatRoutes.js
import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, sendMessage);         // Send message
router.get("/history", protect, getChatHistory); // Get history

export default router;
