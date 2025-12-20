// controllers/aiController.js
const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');

// @desc    Get AI chat response
// @route   POST /api/ai/chat
// @access  Private
exports.getChatResponse = async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        const userId = req.user._id;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Get user data for context
        const user = await User.findById(userId).select('-password');
        const analytics = await UserAnalytics.findOne({ userId });

        // Build context for AI
        const userContext = buildUserContext(user, analytics);

        // Check if Claude API key is configured (highest priority - best quality)
        if (process.env.CLAUDE_API_KEY) {
            console.log('🤖 Attempting to use Claude API...');
            try {
                const aiResponse = await callClaude(message, conversationHistory, userContext);

                return res.json({
                    success: true,
                    response: aiResponse,
                    source: 'claude'
                });
            } catch (aiError) {
                console.error('❌ Claude API Error:', aiError.message);
                console.error('Full error:', aiError);
                // Fall through to try Gemini or OpenAI
            }
        }

        // Check if Gemini API key is configured (priority)
        if (process.env.GEMINI_API_KEY) {
            console.log('🤖 Attempting to use Gemini API...');
            try {
                const aiResponse = await callGemini(message, conversationHistory, userContext);

                return res.json({
                    success: true,
                    response: aiResponse,
                    source: 'gemini'
                });
            } catch (aiError) {
                console.error('❌ Gemini API Error:', aiError.message);
                console.error('Full error:', aiError);
                // Fall through to try OpenAI or fallback
            }
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            // Fallback to pattern-based responses
            const response = generatePatternBasedResponse(message, user, analytics);
            return res.json({
                success: true,
                response,
                source: 'pattern-based'
            });
        }

        // Call OpenAI API
        try {
            const aiResponse = await callOpenAI(message, conversationHistory, userContext);

            res.json({
                success: true,
                response: aiResponse,
                source: 'openai'
            });
        } catch (aiError) {
            console.error('OpenAI API Error:', aiError);

            // Fallback to pattern-based response
            const response = generatePatternBasedResponse(message, user, analytics);
            res.json({
                success: true,
                response,
                source: 'pattern-based',
                note: 'AI API unavailable, using fallback'
            });
        }

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate response'
        });
    }
};

// Call OpenAI API
async function callOpenAI(message, conversationHistory = [], userContext) {
    // Check for mock key to enable fully functional simulation
    if (process.env.OPENAI_API_KEY === 'mock-key-enabled') {
        return await simulateOpenAIResponse(message, conversationHistory, userContext);
    }

    const fetch = (await import('node-fetch')).default;

    const systemPrompt = `You are an AI Career Assistant for Career Compass, a career development platform. 

User Context:
${userContext}

Your role is to:
- Provide personalized career guidance
- Help with interview preparation
- Recommend skills and learning paths
- Review progress and suggest improvements
- Set achievable goals
- Give actionable advice

Be friendly, encouraging, and specific. Use the user's data to personalize responses.
Keep responses concise but informative (max 300 words).`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Last 10 messages for context
        { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages,
            max_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Call Anthropic Claude API
async function callClaude(message, conversationHistory = [], userContext) {
    const Anthropic = require('@anthropic-ai/sdk');

    const anthropic = new Anthropic({
        apiKey: process.env.CLAUDE_API_KEY
    });

    const systemPrompt = `You are an AI Career Assistant for Career Compass, a career development platform. 

User Context:
${userContext}

Your role is to:
- Provide personalized career guidance
- Help with interview preparation
- Recommend skills and learning paths
- Review progress and suggest improvements
- Set achievable goals
- Give actionable advice

Be friendly, encouraging, and specific. Use the user's data to personalize responses.
Keep responses concise but informative (max 300 words).`;

    // Build messages array for Claude
    const messages = [];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.slice(-10).forEach(msg => {
            messages.push({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            });
        });
    }

    // Add current message
    messages.push({
        role: 'user',
        content: message
    });

    // Call Claude API
    const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages
    });

    return response.content[0].text;
}

// Call Google Gemini API using official SDK
async function callGemini(message, conversationHistory = [], userContext) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

    const systemPrompt = `You are an AI Career Assistant for Career Compass, a career development platform. 

User Context:
${userContext}

Your role is to:
- Provide personalized career guidance
- Help with interview preparation
- Recommend skills and learning paths
- Review progress and suggest improvements
- Set achievable goals
- Give actionable advice

Be friendly, encouraging, and specific. Use the user's data to personalize responses.
Keep responses concise but informative (max 300 words).`;

    // Build conversation history for Gemini
    let conversationText = systemPrompt + '\n\n';

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.slice(-10).forEach(msg => {
            if (msg.role === 'user') {
                conversationText += `User: ${msg.content}\n`;
            } else if (msg.role === 'assistant') {
                conversationText += `Assistant: ${msg.content}\n`;
            }
        });
    }

    // Add current message
    conversationText += `User: ${message}\nAssistant:`;

    // Generate content using the SDK
    const result = await model.generateContent(conversationText);
    const response = await result.response;
    const text = response.text();

    return text;
}


// Simulate OpenAI response for "real time" experience
async function simulateOpenAIResponse(message, conversationHistory, userContext) {
    // Simulate network delay (1.5s) for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMsg = message.toLowerCase();

    // Extract user details from context string
    const nameMatch = userContext.match(/Name: (.*)/);
    const userName = nameMatch ? nameMatch[1].trim() : 'Developer';

    // Dynamic response generation based on intent key words

    // Greeting & Status (How are you)
    if (lowerMsg.match(/\b(hi|hello|hey|greetings|how are you|how are you doing)\b/)) {
        if (lowerMsg.includes('how are you')) {
            return `I'm functioning perfectly and energized to help you grow your career, **${userName}**! ⚡

I've been analyzing your profile and I see you're currently at **${userContext.match(/Level: (\d+)/)?.[0] || 'Level 1'}**.

Ready to level up? I can help with:
- 🗺️ **Career Roadmaps**
- 💻 **Mock Coding Interviews**
- 📈 **Resume Reviews**

What's on your mind?`;
        }

        return `Hello **${userName}**! 👋 I'm your Career Compass AI assistant.
        
I'm fully functional and ready to help you with:
- 🎯 **Setting Career Goals**
- 📝 **Mock Interviews & Prep**
- 💻 **Skill Recommendations**
- 📊 **Analyzing your Progress**

What would you like to work on today?`;
    }

    // Roadmaps (General & Specific)
    if (lowerMsg.includes('roadmap') || lowerMsg.includes('path') || lowerMsg.includes('guide')) {
        if (lowerMsg.includes('full stack') || lowerMsg.includes('web developer')) {
            return `Awesome choice, **${userName}**! Full Stack Development is in high demand. 🌐

Here is a 2024 **Full Stack Roadmap** tailored for you:

### 1. Frontend Mastery (Months 1-3)
- **HTML5/CSS3**: Flexbox, Grid, Semantic HTML.
- **JavaScript (ES6+)**: Closures, Promises, Async/Await.
- **Framework**: React.js (Hooks, Context API) or Vue.js.

### 2. Backend Foundation (Months 4-6)
- **Runtime**: Node.js & Express.js.
- **Database**: MongoDB (Structure & Aggregation) & SQL Basics.
- **Auth**: JWT, OAuth.

### 3. DevOps & Deployment (Months 7+)
- **Git**: Advanced workflows.
- **Docker**: Containerization basics.
- **CI/CD**: GitHub Actions.
- **Cloud**: Deploy to Vercel/Render/AWS.

*Action Item: Start by building a "Task Management App" with MERN stack to apply these skills!*`;
        }

        return `I'd love to help you plan your career journey, **${userName}**! 🗺️
        
To generate a specific roadmap, tell me:
1. What role are you aiming for? (e.g., Data Scientist, DevOps, Frontend)
2. What is your current experience level?

Once I know your target, I can outline the exact tools and skills you need.`;
    }

    // Interview Prep
    if (lowerMsg.includes('interview') || lowerMsg.includes('prepare')) {
        return `That's a great initiative, **${userName}**! Preparation is key. 🗝️

Based on your profile, here is a tailored interview prep plan:

### 1. Technical Concepts
Since you are working on your skills, focus on:
- **Data Structures**: Arrays, Hash Maps, Trees
- **Algorithms**: Sorting, Search, DFS/BFS
- **System Design**: Scalability basics

### 2. Behavioral Questions (STAR Method)
Prepare stories for:
- "Tell me about a challenging project."
- "How do you handle conflict?"

### 3. Mock Practice
I can simulate an interviewer right now. Type **"Start Mock Interview"** to begin!`;
    }

    // Skills & Learning
    if (lowerMsg.includes('skill') || lowerMsg.includes('learn') || lowerMsg.includes('java') || lowerMsg.includes('python') || lowerMsg.includes('react') || lowerMsg.includes('stack')) {
        return `Excellent focus on growth! 🚀
         
Considering the current industry trends and your level, I recommend:

**Suggested Learning Path:**
1. **Advanced JavaScript/TypeScript**: Essential for modern web dev.
2. **Cloud Fundamentals (AWS)**: highly valued.
3. **Backend Architecture**: Microservices & API Design.

*Tip: Try to build a small project for each concept you learn to boost your XP!*`;
    }

    // Project Ideas
    if (lowerMsg.includes('project') || lowerMsg.includes('build')) {
        return `Building projects is the best way to learn! 🛠️
        
Here are 3 portfolio-worthy ideas:
1. **E-commerce Dashboard**: React + Node.js + Chart.js.
2. **Real-time Chat App**: Socket.io + MongoDB.
3. **Task Tracker**: with Drag-and-Drop functionality.

Which one sounds interesting to you? I can help you break it down into tasks.`;
    }

    // General Advice / Fallback with Personality
    return `I see you're interested in **"${message}"**. 🤔

As your specialized Career AI, I'm best at:
- 🛣️ Creating learning roadmaps
- 💼 Interview prep
- 🐛 Debugging code logic
- 📈 Analyzing your profile stats

Could you rephrase your question? For example:
- *"Give me a roadmap for DevOps"*
- *"How do I answer 'Tell me about yourself'?"*
- *"Suggest a project for Python"*`;
}

// Build user context for AI
function buildUserContext(user, analytics) {
    const context = [];

    context.push(`Name: ${user.fullName || user.username}`);
    context.push(`Level: ${user.level || 1}`);
    context.push(`Total XP: ${user.xp || 0}`);
    context.push(`Current Streak: ${user.streak || 0} days`);

    if (user.skills && user.skills.length > 0) {
        const skillsList = user.skills.map(s => `${s.name} (${s.level})`).join(', ');
        context.push(`Skills: ${skillsList}`);
    }

    if (user.projects && user.projects.length > 0) {
        context.push(`Projects: ${user.projects.length} completed`);
    }

    if (analytics) {
        context.push(`Total Activities: ${analytics.totalActivitiesCompleted || 0}`);
        context.push(`Total Time Spent: ${Math.round((analytics.totalTimeSpent || 0) / 60)} hours`);

        if (analytics.performanceMetrics?.goalTracking) {
            const goals = analytics.performanceMetrics.goalTracking;
            context.push(`Goals: ${goals.completedGoals || 0}/${goals.totalGoals || 0} completed`);
        }
    }

    return context.join('\n');
}

// Pattern-based fallback response
function generatePatternBasedResponse(query, user, analytics) {
    const lowerQuery = query.toLowerCase();

    // Interview preparation
    if (lowerQuery.includes('interview')) {
        return `Great! Let me help you prepare for interviews. Based on your profile:

**Technical Interview Tips:**
• Practice coding problems on platforms like LeetCode
• Review data structures and algorithms
• Prepare examples using the STAR method
• Research the company's tech stack

**Your Skills to Highlight:**
${user?.skills?.slice(0, 3).map(s => `• ${s.name} (${s.level})`).join('\n') || '• Add skills to your profile first!'}

**Mock Interview Practice:**
Go to the Interview Prep section to practice with AI-powered mock interviews.

Would you like specific tips for any particular type of interview?`;
    }

    // Career goals
    if (lowerQuery.includes('goal') || lowerQuery.includes('career')) {
        return `Let's set some meaningful career goals! Here are my recommendations:

**Short-term Goals (1-3 months):**
• Complete 2-3 online courses in your target skills
• Build 1-2 portfolio projects
• Contribute to open-source projects
• Network with 5-10 professionals in your field

**Medium-term Goals (3-6 months):**
• Master advanced concepts in your primary skill
• Prepare and pass technical interviews
• Build a strong GitHub profile
• Create a personal brand on LinkedIn

**Long-term Goals (6-12 months):**
• Land your dream job or promotion
• Mentor junior developers
• Speak at tech meetups or conferences
• Build a side project that generates income

Would you like help creating specific, measurable goals?`;
    }

    // Skills recommendation
    if (lowerQuery.includes('skill') || lowerQuery.includes('learn')) {
        const currentSkills = user?.skills?.map(s => s.name).join(', ') || 'none listed';
        return `Based on your current skills (${currentSkills}), here are my recommendations:

**High-Demand Skills to Learn:**
• **TypeScript** - Industry standard for large projects
• **Docker & Kubernetes** - Essential for DevOps
• **System Design** - Critical for senior roles
• **Cloud Platforms** (AWS/Azure/GCP) - High market demand
• **GraphQL** - Modern API development

**Learning Path:**
1. Start with fundamentals (if needed)
2. Build small projects to practice
3. Contribute to open-source
4. Document your learning journey
5. Share knowledge through blogs/tutorials

**Resources:**
• Free courses in our platform
• Coding challenges for practice
• Project ideas to build portfolio

Which skill would you like to focus on first?`;
    }

    // Progress review
    if (lowerQuery.includes('progress') || lowerQuery.includes('review')) {
        return `Let me review your progress! 📊

**Your Stats:**
• Level: ${user?.level || 1}
• Total XP: ${user?.xp?.toLocaleString() || 0}
• Current Streak: ${user?.streak || 0} days
• Skills: ${user?.skills?.length || 0}
• Projects: ${user?.projects?.length || 0}

**Strengths:**
✅ You're actively using the platform
✅ Building your skill set
✅ Working on projects

**Areas to Improve:**
${user?.streak < 7 ? '⚠️ Try to maintain a 7-day learning streak' : '✅ Great streak! Keep it up!'}
${user?.skills?.length < 5 ? '⚠️ Add more skills to your profile' : '✅ Good skill diversity!'}
${user?.projects?.length < 3 ? '⚠️ Build more portfolio projects' : '✅ Strong project portfolio!'}

**Next Steps:**
1. Set weekly learning goals
2. Complete daily challenges
3. Build one project per month
4. Network with peers

Keep up the great work! 🚀`;
    }

    // Default response
    return `I understand you're asking about "${query}". Here's how I can help:

**I can assist with:**
• 💼 Career planning and guidance
• 📝 Interview preparation strategies
• 🎯 Goal setting and tracking
• 💻 Skill development recommendations
• 📊 Progress analysis and feedback
• 🚀 Project ideas and guidance

**Quick Actions:**
• Ask me specific questions about your career
• Request personalized learning paths
• Get interview tips for specific companies
• Brainstorm project ideas
• Review your profile and suggest improvements

What specific area would you like to explore?`;
}
