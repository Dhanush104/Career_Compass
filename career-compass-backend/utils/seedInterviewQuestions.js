// utils/seedInterviewQuestions.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const InterviewQuestion = require('../models/InterviewQuestion');

const interviewQuestions = [
    // Technical - JavaScript
    {
        question: "Explain the difference between let, const, and var in JavaScript.",
        category: "technical",
        subcategory: "JavaScript",
        difficulty: "Easy",
        tips: [
            "Discuss scope differences (function vs block)",
            "Explain hoisting behavior",
            "Mention temporal dead zone for let/const",
            "Give practical examples"
        ],
        followUp: "Can you show an example where this difference matters?"
    },
    {
        question: "What is closure in JavaScript and why is it useful?",
        category: "technical",
        subcategory: "JavaScript",
        difficulty: "Medium",
        tips: [
            "Define closure as function + lexical environment",
            "Explain data privacy use case",
            "Show practical examples",
            "Mention memory considerations"
        ],
        followUp: "How would you use closures to create a counter?"
    },
    
    // Technical - React
    {
        question: "How would you optimize a React application for better performance?",
        category: "technical",
        subcategory: "React",
        difficulty: "Medium",
        tips: [
            "Mention React.memo and useMemo",
            "Discuss code splitting and lazy loading",
            "Talk about virtual DOM optimization",
            "Explain bundle size reduction techniques"
        ],
        followUp: "What tools would you use to measure performance?"
    },
    {
        question: "Explain the difference between useEffect and useLayoutEffect.",
        category: "technical",
        subcategory: "React",
        difficulty: "Medium",
        tips: [
            "Timing of execution",
            "Use cases for each",
            "Performance implications",
            "Browser paint considerations"
        ],
        followUp: "When would you choose one over the other?"
    },
    
    // Technical - Backend
    {
        question: "Design a scalable REST API for a social media platform.",
        category: "technical",
        subcategory: "Backend",
        difficulty: "Hard",
        tips: [
            "Define clear resource endpoints",
            "Discuss authentication and authorization",
            "Consider rate limiting and caching",
            "Plan for pagination and filtering"
        ],
        followUp: "How would you handle real-time features like notifications?"
    },
    {
        question: "Explain the difference between SQL and NoSQL databases.",
        category: "technical",
        subcategory: "Database",
        difficulty: "Easy",
        tips: [
            "Structure differences",
            "Scalability considerations",
            "Use cases for each",
            "ACID vs BASE"
        ],
        followUp: "When would you choose MongoDB over PostgreSQL?"
    },
    
    // Behavioral
    {
        question: "Tell me about a time when you had to work with a difficult team member.",
        category: "behavioral",
        subcategory: "Teamwork",
        difficulty: "Medium",
        tips: [
            "Use the STAR method (Situation, Task, Action, Result)",
            "Focus on your actions and communication",
            "Show empathy and understanding",
            "Highlight the positive outcome"
        ],
        followUp: "What would you do differently in a similar situation?"
    },
    {
        question: "Describe a project where you had to learn a new technology quickly.",
        category: "behavioral",
        subcategory: "Learning",
        difficulty: "Easy",
        tips: [
            "Show your learning methodology",
            "Mention resources you used",
            "Discuss challenges and how you overcame them",
            "Quantify the impact of your learning"
        ],
        followUp: "How do you stay updated with new technologies?"
    },
    {
        question: "Tell me about a time you failed and what you learned from it.",
        category: "behavioral",
        subcategory: "Growth",
        difficulty: "Medium",
        tips: [
            "Be honest and authentic",
            "Focus on lessons learned",
            "Show how you applied those lessons",
            "Demonstrate growth mindset"
        ],
        followUp: "How has this experience shaped your approach to work?"
    },
    
    // System Design
    {
        question: "Design a URL shortening service like bit.ly",
        category: "system-design",
        subcategory: "System Design",
        difficulty: "Hard",
        tips: [
            "Start with requirements gathering",
            "Estimate scale and capacity",
            "Design database schema",
            "Discuss caching and CDN strategies"
        ],
        followUp: "How would you handle analytics and click tracking?"
    },
    {
        question: "Design a rate limiter for an API",
        category: "system-design",
        subcategory: "System Design",
        difficulty: "Hard",
        tips: [
            "Discuss different algorithms (token bucket, leaky bucket)",
            "Consider distributed systems",
            "Handle edge cases",
            "Scalability considerations"
        ],
        followUp: "How would you implement this across multiple servers?"
    },
    {
        question: "Design a notification system",
        category: "system-design",
        subcategory: "System Design",
        difficulty: "Medium",
        tips: [
            "Multiple notification channels",
            "Priority and delivery guarantees",
            "User preferences",
            "Scalability and reliability"
        ],
        followUp: "How would you handle millions of notifications per second?"
    },
    
    // Leadership
    {
        question: "How do you handle conflicting priorities from different stakeholders?",
        category: "leadership",
        subcategory: "Management",
        difficulty: "Medium",
        tips: [
            "Discuss communication strategies",
            "Mention stakeholder alignment techniques",
            "Show decision-making framework",
            "Emphasize transparency and documentation"
        ],
        followUp: "Can you give an example from your experience?"
    },
    {
        question: "How do you motivate a team during challenging times?",
        category: "leadership",
        subcategory: "Team Management",
        difficulty: "Medium",
        tips: [
            "Show empathy and understanding",
            "Clear communication of vision",
            "Celebrate small wins",
            "Provide support and resources"
        ],
        followUp: "What specific techniques have worked for you?"
    },
    
    // Company Specific
    {
        question: "Why do you want to work at our company?",
        category: "company-specific",
        subcategory: "Motivation",
        difficulty: "Easy",
        tips: [
            "Research company values and mission",
            "Connect your goals with company goals",
            "Mention specific products or initiatives",
            "Show genuine enthusiasm"
        ],
        followUp: "What do you know about our recent developments?"
    },
    {
        question: "Where do you see yourself in 5 years?",
        category: "company-specific",
        subcategory: "Career Goals",
        difficulty: "Easy",
        tips: [
            "Show ambition but be realistic",
            "Align with company growth",
            "Mention skill development",
            "Balance personal and professional goals"
        ],
        followUp: "How does this role fit into your career plan?"
    },
    
    // Additional Technical Questions
    {
        question: "Explain the concept of promises and async/await in JavaScript.",
        category: "technical",
        subcategory: "JavaScript",
        difficulty: "Medium",
        tips: [
            "Explain asynchronous programming",
            "Compare callbacks, promises, and async/await",
            "Discuss error handling",
            "Show practical examples"
        ],
        followUp: "How would you handle multiple async operations?"
    },
    {
        question: "What are the principles of RESTful API design?",
        category: "technical",
        subcategory: "Backend",
        difficulty: "Easy",
        tips: [
            "Resource-based URLs",
            "HTTP methods (GET, POST, PUT, DELETE)",
            "Stateless communication",
            "Proper status codes"
        ],
        followUp: "How would you version your API?"
    },
    {
        question: "Explain the concept of middleware in Express.js",
        category: "technical",
        subcategory: "Backend",
        difficulty: "Easy",
        tips: [
            "Request-response cycle",
            "Order of execution",
            "Common use cases (auth, logging, error handling)",
            "Custom middleware creation"
        ],
        followUp: "How would you implement authentication middleware?"
    },
    {
        question: "What is the difference between authentication and authorization?",
        category: "technical",
        subcategory: "Security",
        difficulty: "Easy",
        tips: [
            "Authentication verifies identity",
            "Authorization verifies permissions",
            "Common implementations (JWT, OAuth)",
            "Security best practices"
        ],
        followUp: "How would you implement role-based access control?"
    }
];

const seedInterviewQuestions = async () => {
    console.log('🌱 Starting Interview Questions Seeding...\n');
    
    try {
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        console.log('🗑️  Clearing existing interview questions...');
        await InterviewQuestion.deleteMany({});
        console.log('✅ Cleared existing questions\n');
        
        console.log('📝 Inserting interview questions...');
        await InterviewQuestion.insertMany(interviewQuestions);
        console.log(`✅ Inserted ${interviewQuestions.length} interview questions\n`);
        
        // Show summary by category
        const summary = await InterviewQuestion.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    difficulties: { $push: '$difficulty' }
                }
            }
        ]);
        
        console.log('📊 Summary by Category:');
        summary.forEach(cat => {
            const easy = cat.difficulties.filter(d => d === 'Easy').length;
            const medium = cat.difficulties.filter(d => d === 'Medium').length;
            const hard = cat.difficulties.filter(d => d === 'Hard').length;
            console.log(`   ${cat._id}: ${cat.count} questions (Easy: ${easy}, Medium: ${medium}, Hard: ${hard})`);
        });
        
        console.log('\n═══════════════════════════════════════════════════');
        console.log('🎉 INTERVIEW QUESTIONS SEEDING COMPLETED!');
        console.log('═══════════════════════════════════════════════════\n');
        
    } catch (error) {
        console.error('❌ Seeding failed!');
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

seedInterviewQuestions();
