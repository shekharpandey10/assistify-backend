import mongoose from "mongoose";

const contextSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  embedding: { type: [Number], default: [],required:true }, // store embedding vector
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Context", contextSchema);