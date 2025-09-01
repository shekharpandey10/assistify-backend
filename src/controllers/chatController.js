// backend/src/controllers/chatController.js
import Conversation from "../models/Conversation.js";
import { getAIResponse } from "../utils/aiClient.js";

// Send a message and get AI reply
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    // Add user message
    conversation.messages.push({ sender: "user", message });

    // Get AI response
    const botReply = await getAIResponse(message, conversation.messages);
    conversation.messages.push({ sender: "bot", message: botReply });

    await conversation.save();

    res.json({
      messages: conversation.messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversation = await Conversation.findOne({ userId });

    res.json({
      messages: conversation ? conversation.messages : [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
