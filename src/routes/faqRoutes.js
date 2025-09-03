// backend/src/routes/faqRoutes.js
import express from "express";
import fs from "fs";
import { protect } from "../middlewares/authMiddleware.js";
import { adminAuth } from "../middlewares/admin.js";
import Context from "../models/Context.js";
import { upload } from "../utils/upload.js"; // multer
import { GoogleGenAI } from "@google/genai";
const router = express.Router();
const ai = new GoogleGenAI({});





router.post("/", protect, adminAuth, upload.single("file"), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Extract file content if uploaded
    let fileContent = "";
    if (req.file) {
      fileContent = await extractFileText(req.file.path);
      fs.unlinkSync(req.file.path); // remove file after extracting
    }

    // Use either text content from body or file
    const finalContent = content || fileContent;

    if (!finalContent) {
      return res
        .status(400)
        .json({ success: false, message: "Either content or file is required" });
    }

    // Generate Gemini embedding
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: [finalContent],
    });
console.log(typeof response.embeddings); // should be 'object'
console.log(Array.isArray(response.embeddings[0].values)); 
    const embeddingArray = response.embeddings[0].values; // embeddings is an array
    console.log(embeddingArray, ' embedding')
    // Save to MongoDB
   const newContext = new Context({
  title: title,
  content: finalContent,
  embedding: embeddingArray,
  uploadedBy: req.user._id,
});

console.log(newContext,'new context')
    await newContext.save();

    res.status(201).json({
      success: true,
      message: "Context uploaded successfully",
      context: newContext,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ success: false, message: "Failed to upload context", error: error.message });
  }
});



// Update context by ID
router.put("/:id", protect, adminAuth, async (req, res) => {
  try {
    const context = await Context.findById(req.params.id);
    if (!context) return res.status(404).json({ success: false, message: "Context not found" });

    const { title, content } = req.body;
    if (title) context.title = title;
    if (content) context.content = content;

    await context.save();
    res.json({ success: true, message: "Context updated", context });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update context" });
  }
});

// Delete context by ID
router.delete("/:id", protect, adminAuth, async (req, res) => {
  try {
    const context = await Context.findById(req.params.id);
    if (!context) return res.status(404).json({ success: false, message: "Context not found" });

    await context.deleteOne();
    res.json({ success: true, message: "Context deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete context" });
  }
});

//Public routes

// Get all contexts
router.get("/", async (req, res) => {
  try {
    const contexts = await Context.find().sort({ createdAt: -1 });
    res.json({ success: true, contexts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch contexts" });
  }
});

// Get single context by ID
router.get("/:id", async (req, res) => {
  try {
    const context = await Context.findById(req.params.id);
    if (!context) return res.status(404).json({ success: false, message: "Context not found" });
    res.json({ success: true, context });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch context" });
  }
});

export default router;
