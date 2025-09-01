// backend/src/routes/faqRoutes.js
import express from "express";

const router = express.Router();

// Temporary in-memory FAQ storage
let faqs = [];

// Add/Upload FAQ
router.post("/", (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Both question and answer are required" });
  }

  const newFaq = {
    id: faqs.length + 1,
    question,
    answer,
  };

  faqs.push(newFaq);

  res.status(201).json({
    success: true,
    message: "FAQ added successfully",
    faq: newFaq,
  });
});

// Get all FAQs
router.get("/", (req, res) => {
  res.json({
    success: true,
    faqs,
  });
});

// Get a single FAQ by ID
router.get("/:id", (req, res) => {
  const faq = faqs.find(f => f.id === parseInt(req.params.id));
  if (!faq) {
    return res.status(404).json({ error: "FAQ not found" });
  }
  res.json({ success: true, faq });
});

// Delete FAQ by ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  faqs = faqs.filter(f => f.id !== id);
  res.json({ success: true, message: `FAQ with id ${id} deleted.` });
});

export default router;
