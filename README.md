# Assistify – Chatbot & FAQ Backend

A simple backend for a chatbot app with FAQ support.  
Built with **Node.js** and **Express**, using **MongoDB** for data storage.  
Integrates with **Google Gemini** for AI-powered chat responses.

---

##  Features
-  User registration & login (JWT-protected)
-  AI chatbot with Google Gemini
-  Chat history storage
-  Add, update, and view FAQs

---

##  Tech Stack
- **Node.js + Express** → REST API server  
- **MongoDB + Mongoose** → Database & models  
- **JWT** → Authentication  
- **Google Gemini API** → AI responses  

---

##  How to Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/shekharpandey10/assistify-backend.git
   cd assistify-backend
Install dependencies

bash
npm install
Set up .env

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
Start the server

bash
Copy code
npm run dev
Server will run at: http://localhost:5000