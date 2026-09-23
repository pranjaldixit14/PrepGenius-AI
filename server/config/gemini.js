let geminiClient = null;

export const getGeminiClient = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }

  if (!geminiClient) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      geminiClient = new GoogleGenAI({ apiKey });
    } catch (err) {
      console.warn('[Gemini] GenAI SDK not loaded or keyless. Resilient built-in AI evaluation is active.');
      return null;
    }
  }
  return geminiClient;
};

export const getGeminiModel = () => {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
};
