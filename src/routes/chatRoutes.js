// backend/src/routes/chatRoutes.js
import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

console.log('chat route...')
router.post("/", protect, sendMessage);         // Send message
router.get("/history", protect, getChatHistory); // Get history

export default router;
