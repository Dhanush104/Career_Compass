# 🤖 AI API Integration Setup Guide

## Overview
Complete guide to integrate OpenAI API with the AI Career Assistant feature.

---

## 🔑 Getting Your OpenAI API Key

### Step 1: Create OpenAI Account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email or Google account
3. Verify your email address

### Step 2: Get API Key
1. Log in to [https://platform.openai.com](https://platform.openai.com)
2. Click on your profile (top-right)
3. Select **"View API keys"** or go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Click **"Create new secret key"**
5. Give it a name (e.g., "Career Compass AI")
6. **Copy the key immediately** (you won't see it again!)
7. Store it securely

### Step 3: Add Billing (Required)
1. Go to **Settings** → **Billing**
2. Add a payment method
3. Set up usage limits (recommended: $5-10/month for testing)
4. OpenAI charges per token used (~$0.002 per 1K tokens for GPT-3.5)

---

## ⚙️ Backend Setup

### 1. Install Dependencies
```bash
cd career-compass-backend
npm install node-fetch
```

### 2. Add API Key to .env
Open `.env` file and add your OpenAI API key:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo
```

**Important:** 
- Replace `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual API key
- Never commit `.env` file to Git
- Keep your API key secret

### 3. Verify Files Created
Check that these files exist:
- ✅ `controllers/aiController.js`
- ✅ `routes/ai.js`
- ✅ `server.js` (updated with AI routes)

### 4. Restart Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully!
Server running on port 5000
```

---

## 🎨 Frontend Setup

### 1. Verify Files Updated
Check that these files are updated:
- ✅ `components/AIAssistant.jsx` (calls backend API)
- ✅ `components/Dashboard.jsx` (includes AI Assistant)

### 2. No Additional Dependencies Needed
The frontend already has all required dependencies.

### 3. Restart Frontend
```bash
cd career-compass-frontend
npm run dev
```

---

## 🧪 Testing the Integration

### Test 1: Without API Key (Pattern-Based Fallback)
1. Don't add API key to `.env` or use invalid key
2. Open AI Assistant
3. Ask a question
4. Should get pattern-based response
5. Check console for "AI API unavailable, using fallback"

### Test 2: With API Key (OpenAI Integration)
1. Add valid API key to `.env`
2. Restart backend server
3. Open AI Assistant
4. Ask a question
5. Should get OpenAI-powered response
6. Response will be more natural and context-aware

### Test 3: Conversation History
1. Ask multiple questions in sequence
2. AI should remember context from previous messages
3. Try follow-up questions like "tell me more" or "what else?"

---

## 📊 API Endpoint Details

### POST /api/ai/chat

**Request:**
```json
{
  "message": "Help me prepare for interviews",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response (OpenAI):**
```json
{
  "success": true,
  "response": "AI generated response...",
  "source": "openai"
}
```

**Response (Fallback):**
```json
{
  "success": true,
  "response": "Pattern-based response...",
  "source": "pattern-based",
  "note": "AI API unavailable, using fallback"
}
```

---

## 💰 Cost Estimation

### OpenAI Pricing (GPT-3.5-Turbo)
- **Input:** $0.0015 per 1K tokens
- **Output:** $0.002 per 1K tokens

### Typical Usage
- Average conversation: ~500-1000 tokens
- Cost per conversation: ~$0.001-0.002
- 1000 conversations: ~$1-2
- Monthly (moderate use): ~$5-10

### Cost Optimization Tips
1. Set `max_tokens: 500` (already configured)
2. Limit conversation history to last 10 messages
3. Use GPT-3.5-Turbo (cheaper than GPT-4)
4. Set usage limits in OpenAI dashboard
5. Monitor usage regularly

---

## 🔒 Security Best Practices

### 1. API Key Security
```bash
# ✅ DO:
- Store in .env file
- Add .env to .gitignore
- Use environment variables
- Rotate keys regularly

# ❌ DON'T:
- Commit to Git
- Share publicly
- Hardcode in source
- Use in frontend directly
```

### 2. Rate Limiting
Add to `aiController.js`:
```javascript
// Limit: 10 requests per minute per user
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: 'Too many AI requests, please try again later'
});

router.post('/chat', aiLimiter, getChatResponse);
```

### 3. Input Validation
```javascript
// Validate message length
if (message.length > 1000) {
    return res.status(400).json({
        error: 'Message too long (max 1000 characters)'
    });
}
```

---

## 🎯 Features Implemented

### Backend (aiController.js)
- ✅ OpenAI API integration
- ✅ Pattern-based fallback
- ✅ User context building
- ✅ Conversation history support
- ✅ Error handling
- ✅ Token optimization

### Frontend (AIAssistant.jsx)
- ✅ API call to backend
- ✅ Loading states
- ✅ Error handling
- ✅ Local fallback
- ✅ Conversation history
- ✅ Source indication

---

## 🔄 How It Works

### Flow Diagram
```
User sends message
    ↓
Frontend → Backend API
    ↓
Backend checks API key
    ↓
┌─────────────────┬──────────────────┐
│  API Key Valid  │  No API Key      │
│                 │  or Invalid      │
├─────────────────┼──────────────────┤
│ Call OpenAI API │ Use Pattern-     │
│                 │ Based Response   │
│ Get AI response │                  │
│                 │ Generate local   │
│ Return to user  │ response         │
│                 │                  │
│ Source: openai  │ Source: pattern  │
└─────────────────┴──────────────────┘
    ↓
Frontend displays response
    ↓
User continues conversation
```

### Context Building
```javascript
// Backend builds context from user data:
Name: John Doe
Level: 8
Total XP: 3,250
Current Streak: 7 days
Skills: React (Advanced), JavaScript (Expert)
Projects: 3 completed
Total Activities: 89
Total Time Spent: 40 hours
Goals: 2/7 completed
```

### AI System Prompt
```
You are an AI Career Assistant for Career Compass.

User Context:
[User's data here]

Your role is to:
- Provide personalized career guidance
- Help with interview preparation
- Recommend skills and learning paths
- Review progress and suggest improvements
- Set achievable goals
- Give actionable advice

Be friendly, encouraging, and specific.
Keep responses concise (max 300 words).
```

---

## 🐛 Troubleshooting

### Issue 1: "API Key Invalid"
**Solution:**
1. Check `.env` file has correct key
2. Ensure no extra spaces
3. Key should start with `sk-`
4. Restart backend server after adding key

### Issue 2: "Insufficient Quota"
**Solution:**
1. Check OpenAI billing dashboard
2. Add payment method
3. Increase usage limits
4. Check if free trial expired

### Issue 3: "Rate Limit Exceeded"
**Solution:**
1. Wait a few minutes
2. Reduce request frequency
3. Upgrade OpenAI plan
4. Implement request queuing

### Issue 4: "Pattern-Based Response Always"
**Solution:**
1. Verify API key in `.env`
2. Check backend console for errors
3. Test API key with curl:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}]}'
```

### Issue 5: "Network Error"
**Solution:**
1. Check backend is running
2. Verify frontend API URL
3. Check CORS settings
4. Ensure authentication token is valid

---

## 📈 Monitoring Usage

### OpenAI Dashboard
1. Go to [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. View daily/monthly usage
3. See cost breakdown
4. Set up alerts

### Backend Logging
Add to `aiController.js`:
```javascript
console.log(`AI Request: ${userId} - ${message.substring(0, 50)}...`);
console.log(`AI Response Source: ${source}`);
console.log(`Tokens Used: ${data.usage?.total_tokens || 'N/A'}`);
```

---

## 🚀 Alternative AI Providers

### If OpenAI is too expensive, consider:

**1. Anthropic Claude**
- Similar pricing
- Good for conversations
- API: https://www.anthropic.com/api

**2. Google Gemini**
- Free tier available
- Good performance
- API: https://ai.google.dev/

**3. Cohere**
- Cheaper alternative
- Good for text generation
- API: https://cohere.com/

**4. Local Models (Free)**
- Ollama (run locally)
- LM Studio
- No API costs
- Requires good hardware

---

## ✅ Checklist

### Backend Setup
- [ ] Created `controllers/aiController.js`
- [ ] Created `routes/ai.js`
- [ ] Updated `server.js` with AI routes
- [ ] Added OpenAI API key to `.env`
- [ ] Installed `node-fetch` package
- [ ] Restarted backend server

### Frontend Setup
- [ ] Updated `AIAssistant.jsx` to call API
- [ ] Verified Dashboard includes AI button
- [ ] Tested AI Assistant opens
- [ ] Restarted frontend server

### Testing
- [ ] Tested without API key (fallback works)
- [ ] Tested with API key (OpenAI works)
- [ ] Tested conversation history
- [ ] Checked error handling
- [ ] Verified cost tracking

### Security
- [ ] API key in `.env` only
- [ ] `.env` in `.gitignore`
- [ ] No API key in frontend
- [ ] Rate limiting considered
- [ ] Usage limits set

---

## 📝 Summary

**What You Have:**
- ✅ Complete AI API integration
- ✅ OpenAI GPT-3.5-Turbo support
- ✅ Pattern-based fallback
- ✅ Conversation history
- ✅ User context awareness
- ✅ Error handling
- ✅ Cost optimization

**To Get Started:**
1. Get OpenAI API key
2. Add to `.env` file
3. Restart backend
4. Test AI Assistant
5. Monitor usage

**Cost:** ~$5-10/month for moderate use

**Your AI Assistant is ready for production!** 🎉
