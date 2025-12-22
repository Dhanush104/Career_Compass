// utils/listModels.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

async function listModels() {
    console.log('🔑 Using API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: listModels is not directly exposed on the client in all versions, 
        // accessing via the model manager if possible or just trying a standard one.
        // Actually, the SDK doesn't always have a listModels method easily accessible 
        // without newer versions. Let's try a direct fetch ifSDK fails, but let's try 
        // the most basic "gemini-pro" first with a simple generation ensuring no other params are weird.

        // But to actually LIST models, we might need to use the REST API if the SDK doesn't expose it nicely.
        // Let's try to verify the specific model 'gemini-1.5-flash-latest' or just 'gemini-pro'

        console.log('Testing model: gemini-1.5-flash');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Hello?");
            console.log('✅ gemini-1.5-flash IS WORKING');
        } catch (e) {
            console.log('❌ gemini-1.5-flash failed:', e.message);
        }

        console.log('Testing model: gemini-pro');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello?");
            console.log('✅ gemini-pro IS WORKING');
        } catch (e) {
            console.log('❌ gemini-pro failed:', e.message);
        }

    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

listModels();
