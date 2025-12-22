// utils/checkModels.js
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ No API Key found in .env');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('🔍 Querying Google Gemini API for available models...');

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`❌ API Request Failed with status: ${res.statusCode}`);
            console.error('Response:', data);
            return;
        }

        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log('✅ Available Models:');
                json.models.forEach(m => {
                    if (m.name.includes('gemini')) {
                        console.log(` - ${m.name.replace('models/', '')} (${m.supportedGenerationMethods.join(', ')})`);
                    }
                });
            } else {
                console.log('⚠️ No models found in response:', json);
            }
        } catch (e) {
            console.error('❌ Failed to parse JSON:', e.message);
            console.log('Raw data:', data);
        }
    });

}).on('error', (err) => {
    console.error('❌ Network Error:', err.message);
});
