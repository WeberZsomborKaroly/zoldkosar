const express = require('express');
const router = express.Router();
const OpenAI = require('openai');


let openai;
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
} catch (error) {
    console.error('Error initializing OpenAI:', error);
}

router.post('/', async (req, res) => {
    try {
        if (!openai) {
            throw new Error('OpenAI client not initialized');
        }

        const { message } = req.body;
        console.log('Received message:', message);

        if (!message) {
            return res.status(400).json({ 
                error: 'Üzenet megadása kötelező' 
            });
        }

        console.log('Sending request to OpenAI...');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Te egy segítőkész asszisztens vagy egy webshopban, amely élelmiszereket és italokat árul. 
                    Segítesz a vásárlóknak termékeket találni, válaszolsz a kérdéseikre és általános támogatást nyújtasz. 
                    Válaszolj magyarul, barátságosan és informatívan. A válaszaid legyenek rövidek és lényegre törőek.
                    Az üzletben található termékek: borok, sörök, üdítők, chips-ek, snackek, édességek és egyéb nassolnivalók.
                    Segíts az árakkal, szállítással, fizetési módokkal kapcsolatos kérdésekben is.`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        console.log('OpenAI response:', completion.choices[0].message);
        res.json({ 
            response: completion.choices[0].message.content 
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ 
            error: 'Hiba történt a válasz generálása közben. Kérlek próbáld újra.',
            details: error.message
        });
    }
});

module.exports = router;
