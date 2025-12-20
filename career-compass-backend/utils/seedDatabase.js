// utils/seedDatabase.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const CareerPath = require('../models/CareerPath');
const CodingChallenge = require('../models/CodingChallenge');

const seedCareerPaths = async () => {
    console.log('🌱 Seeding Career Paths...');
    
    const careerPaths = [
        {
            name: 'Full Stack Developer',
            description: 'Master both frontend and backend development to build complete web applications',
            matchKeywords: ['full stack', 'web development', 'frontend', 'backend', 'javascript', 'react', 'node'],
            roadmapTemplate: [
                {
                    milestoneTitle: 'Frontend Fundamentals',
                    tasks: [
                        {
                            title: 'Learn HTML & CSS',
                            description: 'Master HTML5 and CSS3 fundamentals including flexbox and grid',
                            resources: [
                                { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
                                { title: 'CSS Tricks', url: 'https://css-tricks.com' }
                            ]
                        },
                        {
                            title: 'JavaScript Basics',
                            description: 'Learn JavaScript fundamentals, ES6+ features, and DOM manipulation',
                            resources: [
                                { title: 'JavaScript.info', url: 'https://javascript.info' },
                                { title: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net' }
                            ]
                        }
                    ]
                },
                {
                    milestoneTitle: 'Modern Frontend Framework',
                    tasks: [
                        {
                            title: 'Learn React',
                            description: 'Master React including hooks, context, and state management',
                            resources: [
                                { title: 'React Official Docs', url: 'https://react.dev' },
                                { title: 'React Tutorial', url: 'https://react-tutorial.app' }
                            ]
                        }
                    ]
                },
                {
                    milestoneTitle: 'Backend Development',
                    tasks: [
                        {
                            title: 'Learn Node.js & Express',
                            description: 'Build RESTful APIs with Node.js and Express',
                            resources: [
                                { title: 'Node.js Docs', url: 'https://nodejs.org/docs' },
                                { title: 'Express Guide', url: 'https://expressjs.com' }
                            ]
                        },
                        {
                            title: 'Database Management',
                            description: 'Learn MongoDB and SQL databases',
                            resources: [
                                { title: 'MongoDB University', url: 'https://university.mongodb.com' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'Data Scientist',
            description: 'Analyze data and build machine learning models to derive insights',
            matchKeywords: ['data science', 'machine learning', 'python', 'statistics', 'ai', 'analytics'],
            roadmapTemplate: [
                {
                    milestoneTitle: 'Python & Statistics',
                    tasks: [
                        {
                            title: 'Learn Python Programming',
                            description: 'Master Python fundamentals and data structures',
                            resources: [
                                { title: 'Python.org', url: 'https://python.org' },
                                { title: 'Real Python', url: 'https://realpython.com' }
                            ]
                        },
                        {
                            title: 'Statistics & Probability',
                            description: 'Learn statistical concepts and probability theory',
                            resources: [
                                { title: 'Khan Academy Statistics', url: 'https://khanacademy.org' }
                            ]
                        }
                    ]
                },
                {
                    milestoneTitle: 'Data Analysis',
                    tasks: [
                        {
                            title: 'Pandas & NumPy',
                            description: 'Master data manipulation with Pandas and NumPy',
                            resources: [
                                { title: 'Pandas Documentation', url: 'https://pandas.pydata.org' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'DevOps Engineer',
            description: 'Automate and optimize software development and deployment processes',
            matchKeywords: ['devops', 'ci/cd', 'docker', 'kubernetes', 'aws', 'cloud', 'automation'],
            roadmapTemplate: [
                {
                    milestoneTitle: 'Linux & Scripting',
                    tasks: [
                        {
                            title: 'Linux Administration',
                            description: 'Learn Linux command line and system administration',
                            resources: [
                                { title: 'Linux Journey', url: 'https://linuxjourney.com' }
                            ]
                        }
                    ]
                },
                {
                    milestoneTitle: 'Containerization',
                    tasks: [
                        {
                            title: 'Docker Fundamentals',
                            description: 'Learn Docker containerization and orchestration',
                            resources: [
                                { title: 'Docker Docs', url: 'https://docs.docker.com' }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    
    try {
        await CareerPath.deleteMany({});
        await CareerPath.insertMany(careerPaths);
        console.log(`✅ Seeded ${careerPaths.length} career paths`);
    } catch (error) {
        console.error('❌ Error seeding career paths:', error.message);
    }
};

const seedCodingChallenges = async () => {
    console.log('🌱 Seeding Coding Challenges...');
    
    const challenges = [
        {
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
            difficulty: 'easy',
            category: 'algorithms',
            tags: ['array', 'hash-table'],
            timeLimit: 30,
            points: 50,
            hints: [
                'Use a hash map to store numbers you\'ve seen',
                'For each number, check if target - number exists in the map'
            ],
            examples: [
                {
                    input: 'nums = [2,7,11,15], target = 9',
                    output: '[0,1]',
                    explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]'
                }
            ],
            testCases: [
                {
                    input: '[2,7,11,15], 9',
                    expectedOutput: '[0,1]',
                    isHidden: false
                },
                {
                    input: '[3,2,4], 6',
                    expectedOutput: '[1,2]',
                    isHidden: false
                }
            ],
            companies: ['Google', 'Amazon', 'Facebook'],
            editorial: {
                approach: 'Use a hash map to store complements',
                complexity: {
                    time: 'O(n)',
                    space: 'O(n)'
                }
            },
            isActive: true,
            featured: true
        },
        {
            title: 'Reverse Linked List',
            description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
            difficulty: 'medium',
            category: 'data-structures',
            tags: ['linked-list', 'recursion'],
            timeLimit: 45,
            points: 100,
            hints: [
                'Think about reversing the pointers',
                'You can solve this iteratively or recursively'
            ],
            examples: [
                {
                    input: 'head = [1,2,3,4,5]',
                    output: '[5,4,3,2,1]',
                    explanation: 'The linked list is reversed'
                }
            ],
            testCases: [
                {
                    input: '[1,2,3,4,5]',
                    expectedOutput: '[5,4,3,2,1]',
                    isHidden: false
                }
            ],
            companies: ['Microsoft', 'Apple', 'Amazon'],
            editorial: {
                approach: 'Iteratively reverse the pointers',
                complexity: {
                    time: 'O(n)',
                    space: 'O(1)'
                }
            },
            isActive: true,
            featured: true
        },
        {
            title: 'Binary Tree Maximum Path Sum',
            description: 'Find the maximum path sum in a binary tree. A path can start and end at any node.',
            difficulty: 'hard',
            category: 'algorithms',
            tags: ['tree', 'recursion', 'dynamic-programming'],
            timeLimit: 60,
            points: 150,
            hints: [
                'Use recursion to calculate path sums',
                'Track the global maximum as you traverse'
            ],
            examples: [
                {
                    input: 'root = [1,2,3]',
                    output: '6',
                    explanation: 'The optimal path is 2 -> 1 -> 3 with sum 6'
                }
            ],
            testCases: [
                {
                    input: '[1,2,3]',
                    expectedOutput: '6',
                    isHidden: false
                }
            ],
            companies: ['Google', 'Facebook', 'Amazon'],
            editorial: {
                approach: 'DFS with global maximum tracking',
                complexity: {
                    time: 'O(n)',
                    space: 'O(h)'
                }
            },
            isActive: true,
            featured: false
        }
    ];
    
    try {
        await CodingChallenge.deleteMany({});
        await CodingChallenge.insertMany(challenges);
        console.log(`✅ Seeded ${challenges.length} coding challenges`);
    } catch (error) {
        console.error('❌ Error seeding coding challenges:', error.message);
    }
};

const seedDatabase = async () => {
    console.log('🚀 Starting Database Seeding...\n');
    
    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // Seed data
        await seedCareerPaths();
        await seedCodingChallenges();
        
        console.log('\n═══════════════════════════════════════════════════');
        console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════════\n');
        
    } catch (error) {
        console.error('❌ Database seeding failed!');
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

// Run the seeding
seedDatabase();
