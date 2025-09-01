import { getAIResponse } from '../utils/aiClient.js';
import Conversation from '../models/Conversation.js';

export const sendMessage = async (req, res) => {
  try {
    const { userMessage } = req.body;

    // 1️⃣ Validate user message
    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({ error: 'User message is required' });
    }

    const userId = req.user.id; // from protect middleware
    console.log('User message:', userMessage);

    // 2️⃣ Find existing conversation or create new
    let conversation = await Conversation.findOne({ userId }).sort({ createdAt: -1 });

    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    // 3️⃣ Get AI response (pass existing history)
    const aiResponse = await getAIResponse(
      userMessage,
      conversation.messages // pass stored history
    );

    // 4️⃣ Append new messages
    const newMessages = [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse || "AI could not generate a response." }
    ];

    conversation.messages.push(...newMessages);
    await conversation.save();

    // 5️⃣ Send response
    res.json({
      aiResponse,
      conversation: conversation.messages
    });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Failed to process the message' });
  }
};

export const getChatHistory = async (req, res) => {
  console.log('fkljalkjflkajklj')
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ userId }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};
