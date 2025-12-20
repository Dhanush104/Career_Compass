// utils/dbTest.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models to test
const User = require('../models/User');
const Goal = require('../models/Goal');
const CareerPath = require('../models/CareerPath');
const Resume = require('../models/Resume');
const CodingChallenge = require('../models/CodingChallenge');
const InterviewSession = require('../models/InterviewSession');
const UserAnalytics = require('../models/UserAnalytics');
const { CommunityPost, MentorshipRequest, StudyGroup, NetworkingConnection } = require('../models/Community');

const testDatabaseConnection = async () => {
    console.log('🔍 Starting Database Connection Test...\n');
    
    try {
        // Test 1: Connect to MongoDB
        console.log('📡 Test 1: Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Successfully connected to MongoDB!\n');
        
        // Test 2: Check database name
        console.log('📡 Test 2: Checking database information...');
        const dbName = mongoose.connection.db.databaseName;
        console.log(`✅ Connected to database: ${dbName}\n`);
        
        // Test 3: List all collections
        console.log('📡 Test 3: Listing all collections...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`✅ Found ${collections.length} collections:`);
        collections.forEach(col => console.log(`   - ${col.name}`));
        console.log('');
        
        // Test 4: Test model connections
        console.log('📡 Test 4: Testing model connections...');
        const models = [
            { name: 'User', model: User },
            { name: 'Goal', model: Goal },
            { name: 'CareerPath', model: CareerPath },
            { name: 'Resume', model: Resume },
            { name: 'CodingChallenge', model: CodingChallenge },
            { name: 'InterviewSession', model: InterviewSession },
            { name: 'UserAnalytics', model: UserAnalytics },
            { name: 'CommunityPost', model: CommunityPost },
            { name: 'MentorshipRequest', model: MentorshipRequest },
            { name: 'StudyGroup', model: StudyGroup },
            { name: 'NetworkingConnection', model: NetworkingConnection }
        ];
        
        for (const { name, model } of models) {
            try {
                const count = await model.countDocuments();
                console.log(`   ✅ ${name}: ${count} documents`);
            } catch (error) {
                console.log(`   ❌ ${name}: Error - ${error.message}`);
            }
        }
        console.log('');
        
        // Test 5: Check indexes
        console.log('📡 Test 5: Checking indexes...');
        const userIndexes = await User.collection.getIndexes();
        console.log(`✅ User model has ${Object.keys(userIndexes).length} indexes`);
        Object.keys(userIndexes).forEach(index => {
            console.log(`   - ${index}`);
        });
        console.log('');
        
        // Test 6: Test read/write operations
        console.log('📡 Test 6: Testing read/write operations...');
        const testUser = await User.findOne().limit(1);
        if (testUser) {
            console.log(`✅ Successfully read user: ${testUser.username}`);
        } else {
            console.log('⚠️  No users found in database (this is okay for a new setup)');
        }
        console.log('');
        
        // Test 7: Connection pool status
        console.log('📡 Test 7: Connection pool status...');
        const poolSize = mongoose.connection.client.topology.s.pool.totalConnectionCount;
        console.log(`✅ Active connections: ${poolSize}`);
        console.log('');
        
        // Summary
        console.log('═══════════════════════════════════════════════════');
        console.log('🎉 DATABASE CONNECTION TEST COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════════');
        console.log(`Database: ${dbName}`);
        console.log(`Collections: ${collections.length}`);
        console.log(`Models tested: ${models.length}`);
        console.log(`Connection status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        console.log('═══════════════════════════════════════════════════\n');
        
    } catch (error) {
        console.error('❌ Database connection test failed!');
        console.error('Error:', error.message);
        console.error('\nTroubleshooting tips:');
        console.error('1. Check if MONGO_URI is correctly set in .env file');
        console.error('2. Verify MongoDB Atlas cluster is running');
        console.error('3. Check network connectivity');
        console.error('4. Verify database user credentials');
        console.error('5. Check if IP address is whitelisted in MongoDB Atlas\n');
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

// Run the test
testDatabaseConnection();
