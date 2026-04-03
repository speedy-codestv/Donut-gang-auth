const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // npm install node-fetch
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve index.html

let codes = {}; // store email -> code

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send code (simulate email) and trigger webhook
app.post('/send-code', (req, res) => {
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "No email provided" });

    const code = generateCode();
    codes[email] = code;

    console.log(`Code for ${email}: ${code}`); // For testing

    // Trigger webhook immediately
    const webhookURL = 'YOUR_WEBHOOK_URL_HERE'; // Replace with your webhook
    fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `User ${email} received the email.` })
    });

    res.json({ success: true });
});

// Verify code and trigger webhook
app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    if (codes[email] === code) {
        const webhookURL = 'https://discord.com/api/webhooks/1489412320340873316/N40FGYid4PxIEsmI9P4biXJlhjmQqvnIDxCxbByKcJWZUWHaAb9Roc3SzsrRymzFLMqq'; // Replace with your webhook
        await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `User ${email} verified the code!` })
        });
        delete codes[email];
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid code" });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));