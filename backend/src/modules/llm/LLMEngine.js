const axios = require("axios");

class LLMEngine {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || null;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async generateResponse({ messages, context, intent, mode }) {
    if (!this.isConfigured()) {
      return null; // Return null so caller uses rich deterministic fallback
    }

    try {
      // Example call structure for Gemini / OpenAI
      if (process.env.GEMINI_API_KEY) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const systemPrompt = `You are AURA AI, an intelligent academic copilot for college students. Intent: ${intent}. Student Context: ${JSON.stringify(context)}. Provide concise, supportive, academic guidance.`;

        const response = await axios.post(url, {
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...messages.map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.content }],
            })),
          ],
        });

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
      }
    } catch (err) {
      console.error("LLM Provider error:", err.message);
      return null;
    }
    return null;
  }
}

module.exports = new LLMEngine();
