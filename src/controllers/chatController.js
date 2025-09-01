import { getAIResponse } from '../utils/aiClient.js';
import Conversation from '../models/Conversation.js';

export const sendMessage = async (req, res) => {
  try {
    const { userMessage, conversationHistory = [] } = req.body;

    // 1️⃣ Validate user message
    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({ error: 'User message is required' });
    }

    const userId = req.user.id; // from protect middleware
    console.log('User message:', userMessage);

    // 2️⃣ Get AI response
    const aiResponse = await getAIResponse(userMessage, conversationHistory);
    // console.log('AI response:', aiResponse);
  
    // 3️⃣ Prepare conversation data
    const messagesToSave = [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse || "AI could not generate a response." }
    ];
    console.log(messagesToSave,'message to save')
    // 4️⃣ Save to MongoDB with userId
    const conversation = new Conversation({ userId, messages: messagesToSave });
    console.log(conversation,'conversation')
    await conversation.save();

    // 5️⃣ Send response to client
    res.json({
      aiResponse,
      conversation: messagesToSave
    });


  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Failed to process the message' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware
    const conversations = await Conversation.find({ userId }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};
