# Assistify – Chatbot & FAQ Backend

A simple backend for a chatbot app with FAQ support.  
Built with Node.js and Express. Uses MongoDB to store conversations and FAQs.  
Also connects to Google Gemini for AI-powered responses.

## What It Does

- Users can register and log in (protected with JWT)
- Chat with an AI using Google Gemini
- Saves your chat history
- Full support for adding and viewing FAQs

---

## Tech Used

- Node.js + Express –> for the server
- MongoDB + Mongoose –> to store data
- JWT –> for user login and auth
- Google Gemini API –> powers the AI replies

---

## How to Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/shekharpandey10/assistify-backend.git
   cd assistify-backend
   ```

### Install Packages

```bash
npm install


##  .env configuration

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_string_like_myChatbotSecret123
GEMINI_API_KEY=your_gemini_api_key_here

#start the server
npm run dev
```
