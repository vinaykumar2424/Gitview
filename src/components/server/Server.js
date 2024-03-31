const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');
const sanitizeHtml = require('sanitize-html');
const app = express();
// const rateLimit = require('express-rate-limit');
const port = 5000;
const bodyParser = require('body-parser');
const compression = require('compression');
require('dotenv').config({ path: '../../.env' });
console.log('dotenv config:', require('dotenv').config());
console.log('apiKey:', process.env.CHATGPT_API_KEY);
app.use(cors());


app.use(express.json());
app.use(compression());
// Increase payload limit to 5MB only for '/doc' route
app.use('/doc', bodyParser.json({ limit: '5mb' }));
app.use('/doc', bodyParser.urlencoded({ extended: true, limit: '5mb' }));

const apiKey = process.env.CHATGPT_API_KEY;
app.post('/doc', async (req, res) => {

    try {

        let prompt = sanitizeHtml(req.body.prompt || '', {
            allowedTags: ['code'],
            allowedAttributes: {},
        });
        // prompt = prompt.replace(/\n/g, ''); // Remove all newline characters

        // console.log(prompt)
        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        if (!apiKey || apiKey.trim() === '') {
            return res.status(401).json({ error: 'Missing or invalid API key' });
        }

        const originalSizeKB = Buffer.byteLength(prompt, 'utf-8') / 1024;

        console.log('Original size:', originalSizeKB);
        console.log(prompt)

        // Add the 'messages' property to the request body
        const messages = [{ role: 'user', content: prompt }];
        req.body.messages = messages;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            max_tokens: 2000,
            messages: messages,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: true }),
        });

        // Validate response
        // console.log(response);
        if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
            return res.status(500).json({ error: 'Invalid response from API' });
        }
        const text = response.data.choices[0].message.content.replace(/\n/g, '<br>');

        res.json({ text });
    } catch (error) {
        // console.error('Error:', error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.error.message });
        } else if (error.request) {
            res.status(500).json({ error: 'Failed to connect to API' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
