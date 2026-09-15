import http from 'http';

const PORT = process.env.AI_PORT || 3001;

/**
 * Standalone Node.js Generative AI Microservice
 * Provides Direct HTTP 200 OK JSON responses for Hugging Face, Groq, and OpenAI APIs
 * (NO 302 or 303 Redirects!)
 */
const server = http.createServer(async (req, res) => {
    // CORS headers for React frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost:3001'}`);

    if (req.method === 'POST' && url.pathname === '/api/ai/generate') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body || '{}');
                const {
                    provider = 'huggingface',
                    token,
                    model = 'meta-llama/Llama-3.1-8B-Instruct',
                    prompt = 'Hello',
                    systemPrompt = 'You are an AI assistant.'
                } = data;

                if (!token) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 200,
                        success: false,
                        error: 'Missing API Token (hf_... or sk-...)',
                        provider
                    }));
                    return;
                }

                if (provider === 'huggingface') {
                    // Call Hugging Face OpenAI-compatible Chat Completions Router
                    const hfRes = await fetch('https://router.huggingface.co/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: prompt }
                            ],
                            max_tokens: 700,
                            temperature: 0.7,
                        })
                    });

                    const hfData = await hfRes.json();
                    
                    if (hfRes.status === 200 && hfData.choices?.[0]?.message?.content) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            status: 200,
                            success: true,
                            content: hfData.choices[0].message.content,
                            provider: 'huggingface_nodejs',
                            model: model
                        }));
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 200,
                        success: false,
                        error: hfData.error?.message || hfData.error || `HTTP ${hfRes.status}`,
                        provider: 'huggingface_nodejs',
                        model: model
                    }));
                    return;
                }

                if (provider === 'groq') {
                    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: model || 'llama-3.3-70b-versatile',
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: prompt }
                            ]
                        })
                    });

                    const groqData = await groqRes.json();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 200,
                        success: groqRes.status === 200,
                        content: groqData.choices?.[0]?.message?.content || '',
                        provider: 'groq'
                    }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 200, success: false, message: `Unsupported provider: ${provider}` }));
            } catch (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 200, success: false, error: err.message }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
    console.log(`🚀 Node.js Generative AI Microservice running on http://localhost:${PORT}`);
});
