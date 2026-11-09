// aifeatures.js - Secure AI Operations with Multi-Model Fallback & Specific Loaders

// ============================================================================
// ⚙️ LOCAL TESTING KEY (Go Live testing ke liye yahan key dalein)
// Dhyan dein: GitHub par push karne se pehle ise khali ("") kar dein!
// ============================================================================
const KEY_PART_1 = "r1SZXojLGJRBc931OtCzavbkFbtHj9LIA";
const LOCAL_TEST_GEMINI_KEY = `AQ.Ab8RN6IgdkwESXl1r${KEY_PART_1}`;

// Clean, Priority-Ordered Non-Duplicate Models Queue
const FALLBACK_MODELS = [
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

// Helper: Call local fallback loop for Go-Live testing
async function callLocalGeminiWithFallback(prompt, apiKey) {
    let lastError = null;

    for (const model of FALLBACK_MODELS) {
        try {
            // ✅ Clean URL: Key query param me bilkul nahi hai
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey.trim() // ✅ Secret header me jaayega
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.3 }
                })
            });

            if (!response.ok) {
                lastError = `Model ${model} failed (${response.status})`;
                continue; // Try next backup model
            }

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                return text;
            }
        } catch (e) {
            lastError = e.message;
            continue;
        }
    }
    throw new Error(lastError || "All local fallback models are busy");
}

// Unified Request Handler
async function requestAI(systemInstruction, userContent) {
    const fullPrompt = `${systemInstruction}\n\nHere is the README Markdown:\n\`\`\`markdown\n${userContent}\n\`\`\``;

    if (!navigator.onLine) {
        throw new Error('Internet connection unavailable. Please check your network.');
    }

    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

    // 🔹 1. LOCAL MODE (VS Code Go-Live)
    if (isLocal && LOCAL_TEST_GEMINI_KEY && LOCAL_TEST_GEMINI_KEY.trim() !== "") {
        try {
            const rawResult = await callLocalGeminiWithFallback(fullPrompt, LOCAL_TEST_GEMINI_KEY);
            return cleanAiResponse(rawResult);
        } catch (err) {
            throw new Error(err.message || 'Local AI generation failed');
        }
    }

    // 🔹 2. PRODUCTION MODE (Vercel Serverless Multi-Model Fallback)
    else {
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: fullPrompt }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'All AI models are busy. Try again shortly.');
            }

            const data = await response.json();
            return cleanAiResponse(data.result || '');
        } catch (err) {
            throw new Error(err.message || 'AI service unavailable');
        }
    }
}

// Markdown fence block cleanup
function cleanAiResponse(rawText) {
    let text = (rawText || '').trim();
    if (text.startsWith('```markdown')) {
        text = text.substring(11);
    } else if (text.startsWith('```')) {
        text = text.substring(3);
    }
    if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
    }
    return text.trim();
}

// 1. Feature: AI README Enhancer (With in-code Instruction Support)
async function aiEnhanceReadme() {
    const currentContent = markdownInput.value.trim();
    if (!currentContent) {
        showToast('Pehle editor me kuch Markdown paste karein!');
        return;
    }

    const instruction = `You are an elite GitHub README architect.
Your task is to enhance and professionally format this README markdown.

IMPORTANT RULES FOR IN-CODE USER INSTRUCTIONS:
1. Carefully check if the user has included any special instructions, comments (e.g. <!-- AI INSTRUCTION: ... -->), notes, or requests inside the markdown.
2. If custom instructions exist, PRIORITIZE and apply them directly to the content (such as changing project names, adding new sections, modifying stacks, or restructuring).
3. Once applied, REMOVE the raw instruction/comment blocks from the final output so the README looks production-ready and clean.
4. If no custom instructions are found, improve overall formatting, clarity, grammar, badges, and layout while keeping existing code blocks and LaTeX math formulas intact.
5. Return ONLY the final raw markdown without conversational intro, markdown fences, or pleasantries.`;

    setAiLoadingState(true, 'enhance', 'Enhancing README with custom instructions...');
    try {
        const enhanced = await requestAI(instruction, currentContent);
        markdownInput.value = enhanced;
        renderMarkdown();
        showToast('README successfully enhanced by AI! ✨');
    } catch (err) {
        showToast(err.message);
    } finally {
        setAiLoadingState(false, 'enhance');
    }
}

// 2. Feature: AI Fix Markdown & Math Errors
async function aiFixErrors() {
    const currentContent = markdownInput.value.trim();
    if (!currentContent) {
        showToast('Editor empty hai!');
        return;
    }

    const instruction = `You are a Markdown and LaTeX syntax debugger. Review the following README markdown and fix any errors:
- Fix broken table pipes, formatting, and unclosed tags.
- Fix broken code fence backticks.
- Fix broken or invalid LaTeX equations.
- Fix broken link/image syntax.
- Return ONLY the fully corrected raw markdown.`;

    setAiLoadingState(true, 'fix', 'Fixing errors with AI...');
    try {
        const fixed = await requestAI(instruction, currentContent);
        markdownInput.value = fixed;
        renderMarkdown();
        showToast('All errors resolved successfully! 🛠️');
    } catch (err) {
        showToast(err.message);
    } finally {
        setAiLoadingState(false, 'fix');
    }
}

// Specific Button Loading State Helper
function setAiLoadingState(isLoading, actionType = 'enhance', message = '') {
    const btnEnhance = document.getElementById('btn-ai-enhance');
    const btnFix = document.getElementById('btn-ai-fix');

    if (isLoading) {
        // Disable both to prevent double-clicks
        if (btnEnhance) btnEnhance.disabled = true;
        if (btnFix) btnFix.disabled = true;

        // Show spinner strictly on the active button
        if (actionType === 'enhance' && btnEnhance) {
            btnEnhance.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Enhancing...`;
        } else if (actionType === 'fix' && btnFix) {
            btnFix.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Fixing...`;
        }

        if (message) showToast(message);
    } else {
        // Restore both buttons to original states
        if (btnEnhance) {
            btnEnhance.disabled = false;
            btnEnhance.innerHTML = `<i class="bi bi-stars"></i> <span class="d-none d-lg-inline">Enhance</span>`;
        }
        if (btnFix) {
            btnFix.disabled = false;
            btnFix.innerHTML = `<i class="bi bi-wrench-adjustable"></i> <span class="d-none d-lg-inline">Fix Errors</span>`;
        }
    }
}

// DOM Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const btnEnhance = document.getElementById('btn-ai-enhance');
    const btnFix = document.getElementById('btn-ai-fix');

    if (btnEnhance) btnEnhance.addEventListener('click', aiEnhanceReadme);
    if (btnFix) btnFix.addEventListener('click', aiFixErrors);
});