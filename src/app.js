import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: ["https://assistify-frontend.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

console.log('hello from app')
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/faqs", faqRoutes);

export default app;
