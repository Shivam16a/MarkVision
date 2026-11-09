// api/gemini.js - Multi-Model Fallback Engine for Production (Vercel)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    KEY_PART_1="r1SZXojLGJRBc931OtCzavbkFbtHj9LIA"
    const apiKey = "AQ.Ab8RN6IgdkwESXl1r";
    const final_key = apiKey`${KEY_PART_1}`
    if (!apiKey) {
        return res.status(500).json({ error: 'AI Service is unconfigured' });
    }

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Valid prompt is required' });
    }

    // Multi-Model Fallback Queue
    const MODELS = [
        // 🥇 Tier 1: Latest Flagships (Fastest & Best Formatting)
        'gemini-3.8-flash',
        'gemini-3.7-flash',
        'gemini-3.5-flash',
        'gemini-2.5-flash',

        // 🥈 Tier 2: Lite Models (Ultra-low latency & High quota backup)
        'gemini-3.5-flash-lite',
        'gemini-2.5-flash-lite',

        // 🥉 Tier 3: Pro & Fallback Workhorses (Deep reasoning & Safety net)
        'gemini-3.1-pro-preview',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
    ];

    let lastError = null;

    // Try each model sequentially until one succeeds
    for (const model of MODELS) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${final_key}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey.trim()
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3,
                    }
                })
            });

            // Agar Rate limit (429), Busy/Overloaded (503), ya server issue ho toh next model try karein
            if (!response.ok) {
                lastError = `Model ${model} returned status${response.status}`;
                continue; // Fallback to next model
            }

            const data = await response.json();
            const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            if (resultText) {
                // Success! Return immediately with the successful model name
                return res.status(200).json({
                    result: resultText,
                    modelUsed: model
                });
            }
        } catch (err) {
            lastError = err.message;
            // Network/request issue with this model, try next
            continue;
        }
    }

    // Agar saare models fail ho gaye
    return res.status(503).json({ error: 'All AI models are currently busy. Please retry shortly.' });
}