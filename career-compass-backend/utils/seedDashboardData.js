// utils/seedDashboardData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Goal = require('../models/Goal');
const UserAnalytics = require('../models/UserAnalytics');
const InterviewSession = require('../models/InterviewSession');
const CodingChallenge = require('../models/CodingChallenge');

const seedDashboardData = async () => {
    console.log('🌱 Starting Dashboard Data Seeding...\n');
    
    try {
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // Find or create a test user
        console.log('👤 Finding or creating test user...');
        let testUser = await User.findOne({ email: 'test@example.com' });
        
        if (!testUser) {
            testUser = await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: 'test123', // In production, this should be hashed
                fullName: 'Test User',
                bio: 'Sample user for testing dashboard features',
                skills: [
                    { name: 'React', level: 'Advanced', yearsOfExperience: 2 },
                    { name: 'JavaScript', level: 'Expert', yearsOfExperience: 3 },
                    { name: 'Node.js', level: 'Intermediate', yearsOfExperience: 1.5 },
                    { name: 'MongoDB', level: 'Intermediate', yearsOfExperience: 1 },
                    { name: 'Python', level: 'Beginner', yearsOfExperience: 0.5 }
                ],
                level: 8,
                xp: 3250,
                streak: 7,
                projects: [
                    {
                        name: 'E-Commerce Platform',
                        description: 'Full-stack e-commerce application with React and Node.js',
                        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
                        githubUrl: 'https://github.com/testuser/ecommerce',
                        liveUrl: 'https://myecommerce.com',
                        status: 'completed'
                    },
                    {
                        name: 'Task Management App',
                        description: 'Collaborative task management tool with real-time updates',
                        technologies: ['React', 'Firebase', 'Material-UI'],
                        githubUrl: 'https://github.com/testuser/taskmanager',
                        status: 'in-progress'
                    },
                    {
                        name: 'Weather Dashboard',
                        description: 'Weather forecast application using OpenWeather API',
                        technologies: ['JavaScript', 'HTML', 'CSS', 'API'],
                        githubUrl: 'https://github.com/testuser/weather',
                        liveUrl: 'https://myweather.com',
                        status: 'completed'
                    }
                ]
            });
            console.log('✅ Test user created');
        } else {
            console.log('✅ Test user found');
        }
        
        const userId = testUser._id;
        
        // Clear existing data for this user
        console.log('\n🗑️  Clearing existing data for test user...');
        await Goal.deleteMany({ userId });
        await UserAnalytics.deleteMany({ userId });
        await InterviewSession.deleteMany({ userId });
        console.log('✅ Cleared existing data\n');
        
        // Create Goals with various statuses and deadlines
        console.log('🎯 Creating sample goals...');
        const today = new Date();
        const goals = [
            {
                userId,
                title: 'Complete React Challenge',
                description: 'Finish the advanced React course and build a capstone project',
                category: 'learning',
                priority: 'high',
                status: 'active',
                progress: 75,
                deadline: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                milestones: [
                    { title: 'Complete Course Modules', completed: true, completedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000) },
                    { title: 'Build Capstone Project', completed: false },
                    { title: 'Deploy to Production', completed: false }
                ]
            },
            {
                userId,
                title: 'Master Data Structures',
                description: 'Study and practice common data structures and algorithms',
                category: 'technical',
                priority: 'high',
                status: 'active',
                progress: 60,
                deadline: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                milestones: [
                    { title: 'Arrays and Strings', completed: true, completedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000) },
                    { title: 'Trees and Graphs', completed: true, completedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000) },
                    { title: 'Dynamic Programming', completed: false }
                ]
            },
            {
                userId,
                title: 'Build Portfolio Website',
                description: 'Create a professional portfolio to showcase projects',
                category: 'career',
                priority: 'medium',
                status: 'active',
                progress: 40,
                deadline: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                milestones: [
                    { title: 'Design Mockup', completed: true, completedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
                    { title: 'Develop Frontend', completed: false },
                    { title: 'Add Projects Section', completed: false },
                    { title: 'Deploy Online', completed: false }
                ]
            },
            {
                userId,
                title: 'Learn System Design',
                description: 'Study system design principles for technical interviews',
                category: 'learning',
                priority: 'medium',
                status: 'active',
                progress: 30,
                deadline: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
                milestones: [
                    { title: 'Read System Design Primer', completed: true, completedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000) },
                    { title: 'Practice Design Problems', completed: false },
                    { title: 'Mock Interviews', completed: false }
                ]
            },
            {
                userId,
                title: 'Contribute to Open Source',
                description: 'Make meaningful contributions to open source projects',
                category: 'career',
                priority: 'low',
                status: 'active',
                progress: 20,
                deadline: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                milestones: [
                    { title: 'Find Projects to Contribute', completed: true, completedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000) },
                    { title: 'Submit First PR', completed: false },
                    { title: 'Get PR Merged', completed: false }
                ]
            },
            {
                userId,
                title: 'Prepare for FAANG Interview',
                description: 'Complete preparation for top tech company interviews',
                category: 'career',
                priority: 'high',
                status: 'completed',
                progress: 100,
                deadline: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                completedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
                milestones: [
                    { title: 'Practice Coding Problems', completed: true, completedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000) },
                    { title: 'Study System Design', completed: true, completedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000) },
                    { title: 'Mock Interviews', completed: true, completedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000) }
                ]
            },
            {
                userId,
                title: 'Complete JavaScript Course',
                description: 'Finish advanced JavaScript concepts course',
                category: 'learning',
                priority: 'medium',
                status: 'completed',
                progress: 100,
                deadline: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
                completedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
                milestones: [
                    { title: 'ES6+ Features', completed: true, completedAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000) },
                    { title: 'Async Programming', completed: true, completedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000) }
                ]
            }
        ];
        
        await Goal.insertMany(goals);
        console.log(`✅ Created ${goals.length} sample goals\n`);
        
        // Create UserAnalytics with rich data
        console.log('📊 Creating user analytics data...');
        
        const analytics = new UserAnalytics({
            userId,
            level: 8,
            totalXP: 3250,
            currentStreak: 7,
            longestStreak: 15,
            totalTimeSpent: 2400, // 40 hours in minutes
            totalSessions: 45,
            totalActivitiesCompleted: 89,
            
            // Daily Activity for last 14 days
            dailyActivity: Array.from({ length: 14 }, (_, i) => {
                const date = new Date(today);
                date.setDate(date.getDate() - (13 - i));
                return {
                    date,
                    activitiesCompleted: Math.floor(Math.random() * 8) + 2,
                    xpEarned: Math.floor(Math.random() * 100) + 50,
                    timeSpent: Math.floor(Math.random() * 120) + 30,
                    sessionsCount: Math.floor(Math.random() * 4) + 1,
                    categories: {
                        interviewPractice: Math.floor(Math.random() * 30) + 10,
                        codingChallenges: Math.floor(Math.random() * 40) + 20,
                        resumeBuilding: Math.floor(Math.random() * 20) + 5,
                        goalTracking: Math.floor(Math.random() * 25) + 10,
                        courseLearning: Math.floor(Math.random() * 35) + 15
                    }
                };
            }),
            
            // Skills Progress
            skillsProgress: [
                {
                    skillName: 'React',
                    currentLevel: 'Advanced',
                    progress: 85,
                    practiceHours: 45.5,
                    lastPracticed: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
                },
                {
                    skillName: 'JavaScript',
                    currentLevel: 'Expert',
                    progress: 95,
                    practiceHours: 67.2,
                    lastPracticed: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000)
                },
                {
                    skillName: 'Node.js',
                    currentLevel: 'Intermediate',
                    progress: 70,
                    practiceHours: 32.8,
                    lastPracticed: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    skillName: 'MongoDB',
                    currentLevel: 'Intermediate',
                    progress: 65,
                    practiceHours: 28.5,
                    lastPracticed: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
                },
                {
                    skillName: 'Python',
                    currentLevel: 'Beginner',
                    progress: 40,
                    practiceHours: 15.3,
                    lastPracticed: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
                }
            ],
            
            // Achievements
            achievements: [
                {
                    id: 'first_goal',
                    title: 'First Goal Completed',
                    description: 'Completed your first goal',
                    category: 'goals',
                    icon: 'target',
                    xpReward: 50,
                    unlockedAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'week_streak',
                    title: 'Week Streak',
                    description: 'Maintained a 7-day learning streak',
                    category: 'streak',
                    icon: 'flame',
                    xpReward: 100,
                    unlockedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'coding_master',
                    title: 'Coding Master',
                    description: 'Solved 50 coding challenges',
                    category: 'challenges',
                    icon: 'code',
                    xpReward: 200,
                    unlockedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'interview_ready',
                    title: 'Interview Ready',
                    description: 'Completed 10 mock interviews',
                    category: 'interviews',
                    icon: 'briefcase',
                    xpReward: 150,
                    unlockedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                }
            ],
            
            // Performance Metrics
            performanceMetrics: {
                goalTracking: {
                    totalGoals: 7,
                    completedGoals: 2,
                    activeGoals: 5,
                    completionRate: 28.57
                },
                codingChallenges: {
                    totalAttempted: 75,
                    solved: 58,
                    successRate: 77.33,
                    averageTime: 25
                },
                interviewPractice: {
                    totalSessions: 12,
                    completedSessions: 10,
                    averageRating: 4.2,
                    totalQuestions: 45
                }
            },
            
            // Learning Insights
            learningInsights: {
                preferredTimeOfDay: 'Morning',
                averageSessionLength: 35,
                mostActiveDay: 'Tuesday',
                productivityScore: 82
            }
        });
        
        await analytics.save();
        console.log('✅ Created user analytics data\n');
        
        // Create Interview Sessions
        console.log('💼 Creating interview sessions...');
        const interviewSessions = [
            {
                userId,
                category: 'technical',
                sessionType: 'mock',
                difficulty: 'medium',
                status: 'completed',
                questions: [
                    {
                        question: 'Explain closures in JavaScript',
                        category: 'JavaScript',
                        difficulty: 'medium',
                        response: 'A closure is a function that has access to variables in its outer scope...',
                        timeSpent: 15
                    },
                    {
                        question: 'Implement a debounce function',
                        category: 'JavaScript',
                        difficulty: 'medium',
                        response: 'function debounce(func, delay) { let timeout; return function(...args) {...}}',
                        timeSpent: 20
                    }
                ],
                duration: 45,
                overallRating: 4,
                completedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                userId,
                category: 'behavioral',
                sessionType: 'practice',
                difficulty: 'easy',
                status: 'completed',
                questions: [
                    {
                        question: 'Tell me about a time you faced a challenge',
                        category: 'Behavioral',
                        difficulty: 'easy',
                        response: 'Used STAR method to describe situation...',
                        timeSpent: 10
                    }
                ],
                duration: 30,
                overallRating: 5,
                completedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
            }
        ];
        
        await InterviewSession.insertMany(interviewSessions);
        console.log(`✅ Created ${interviewSessions.length} interview sessions\n`);
        
        // Summary
        console.log('═══════════════════════════════════════════════════');
        console.log('🎉 DASHBOARD DATA SEEDING COMPLETED!');
        console.log('═══════════════════════════════════════════════════');
        console.log('\n📊 Summary:');
        console.log(`   User: ${testUser.email}`);
        console.log(`   Goals: ${goals.length} (${goals.filter(g => g.status === 'completed').length} completed, ${goals.filter(g => g.status === 'active').length} active)`);
        console.log(`   Projects: ${testUser.projects.length}`);
        console.log(`   Skills: ${testUser.skills.length}`);
        console.log(`   Analytics: Complete with 14 days of activity`);
        console.log(`   Achievements: ${analytics.achievements.length}`);
        console.log(`   Interview Sessions: ${interviewSessions.length}`);
        console.log('\n🔑 Test User Credentials:');
        console.log('   Email: test@example.com');
        console.log('   Password: test123');
        console.log('\n✨ Your dashboard is now fully populated with sample data!');
        console.log('═══════════════════════════════════════════════════\n');
        
    } catch (error) {
        console.error('❌ Seeding failed!');
        console.error('Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

seedDashboardData();
