import Conversation from "../models/Conversation.js";
import Context from "../models/Context.js";
import { getAIResponse } from "../utils/aiClient.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// Compute embedding for a query
const getQueryEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [text],
  });
  return response.embeddings[0].values;
};

// Cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export const sendMessage = async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({ error: 'User message is required' });
    }

    const userId = req.user.id;

    // Fetch or create conversation
    let conversation = await Conversation.findOne({ userId }).sort({ createdAt: -1 });
    if (!conversation) conversation = new Conversation({ userId, messages: [] });

    // Embed the user query
    const queryEmbedding = await getQueryEmbedding(userMessage);
    console.log('user vector ',queryEmbedding)

    // Fetch all contexts with embeddings
    const contexts = await Context.find({ embedding: { $exists: true, $ne: [] } });

    // Rank contexts by similarity
    const topContexts = contexts
      .map(ctx => ({
        ctx,
        score: cosineSimilarity(queryEmbedding, ctx.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // top 3 relevant contexts
console.log( topContexts, '.... top context......//////')
    // Combine top contexts into a system prompt
    const contextText = topContexts
      .map(({ ctx }) => `${ctx.title}: ${ctx.content}`)
      .join("\n\n");
console.log('....start',contextText,'context text')
    const systemPrompt = `
You are a helpful AI assistant. You must ONLY use the context provided below.
If therer is any context so give the relevent reply in breaf.
And give the full reply dont give the half reply.
If the user's question cannot be answered using this context, respond:
"I'm sorry, I cannot answer this question based on the available context."

Context:
${contextText}
`;

    // Merge with conversation history
    const mergedMessages = [
      { role: "system", content: systemPrompt },
      ...conversation.messages.map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userMessage }
    ];

    // Get AI response
    const aiResponse = await getAIResponse(mergedMessages);

    // Save messages to conversation
    conversation.messages.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: aiResponse || "AI could not generate a response." }
    );

    await conversation.save();

    res.json({ aiResponse, conversation: conversation.messages });

  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Failed to process the message" });
  }
};


// Get chat history , add pagination
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch conversations sorted by most recent updatedAt
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 });

  // Flatten all messages from all conversations
    const allMessages = conversations.flatMap(c => 
      c.messages.map(msg => ({
        ...msg.toObject(),
        conversationId: c._id
      }))
    );

    // Paginate messages
    const paginatedMessages = allMessages.slice(skip, skip + limit);

    res.json({
      total: allMessages.length,
      page,
      limit,
      totalPages: Math.ceil(allMessages.length / limit),
      messages: paginatedMessages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
