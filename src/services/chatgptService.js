import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side use in development
});

let activeModel = 'hybrid'; // 'openai', 'gemini', or 'hybrid'

export function setActiveModel(model) {
  activeModel = model;
  console.log(`Active AI model set to: ${model}`);
}

async function callGeminiAPI(prompt) {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const API_URL = import.meta.env.VITE_GEMINI_API_URL;
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    
    if (data && data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text || "No response available.";
    } else {
      return "No valid response received from Gemini.";
    }
  } catch (error) {
    console.error('Error with Gemini fallback:', error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
}

/**
 * @param {string} dialogflowMessage - The message from Dialogflow
 * @param {string} context - Optional context from previous conversation
 * @returns {Promise<string>} - Enhanced response from ChatGPT
 */
export async function enhanceWithChatGPT(dialogflowMessage, context = '') {
  try {

    const prompt = context 
      ? `Context: ${context}\n\nDialogflow response: ${dialogflowMessage}\n\nEnhance this response with more detailed information while maintaining the same tone and intent.`
      : `Dialogflow response: ${dialogflowMessage}\n\nEnhance this response with more detailed information while maintaining the same tone and intent.`;
    
    if (activeModel === 'gemini') {
      const geminiPrompt = `You are a mental health assistant that enhances responses from a chatbot with more empathetic and detailed information. ${prompt}`;
      return await callGeminiAPI(geminiPrompt);
    }
    
    if (activeModel === 'openai' || activeModel === 'hybrid') {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          store: true,
          messages: [
            { role: "system", content: "You are a mental health assistant that enhances responses from a chatbot with more empathetic and detailed information." },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        return response.choices[0].message.content.trim();
      } catch (error) {

        if (activeModel === 'hybrid') {
          console.warn('OpenAI API error, falling back to Gemini:', error);
          const geminiPrompt = `You are a mental health assistant that enhances responses from a chatbot with more empathetic and detailed information. ${prompt}`;
          return await callGeminiAPI(geminiPrompt);
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error enhancing with AI:', error);
    return dialogflowMessage;
  }
}

/**
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous conversation history
 * @returns {Promise<string>} - Response from ChatGPT
 */
export async function chatGPTFallback(userMessage, conversationHistory = []) {
  try {
    const messages = [
      { role: "system", content: "You are Cerebro, a mental health assistant that provides supportive and informative responses. You should be empathetic, professional, and helpful." },
      ...conversationHistory.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: userMessage }
    ];
    
    if (activeModel === 'gemini') {
      const systemPrompt = "You are Cerebro, a mental health assistant that provides supportive and informative responses. You should be empathetic, professional, and helpful.";
      const historyContext = conversationHistory.map(msg => `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`).join("\n");
      const geminiPrompt = `${systemPrompt}\n\nConversation history:\n${historyContext}\n\nUser: ${userMessage}\n\nAssistant:`;
      
      return await callGeminiAPI(geminiPrompt);
    }
    
    if (activeModel === 'openai' || activeModel === 'hybrid') {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          store: true,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        });

        return response.choices[0].message.content.trim();
      } catch (error) {
        if (activeModel === 'hybrid') {
          console.warn('OpenAI API error, falling back to Gemini:', error);
          
          const systemPrompt = "You are Cerebro, a mental health assistant that provides supportive and informative responses. You should be empathetic, professional, and helpful.";
          const historyContext = conversationHistory.map(msg => `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`).join("\n");
          const geminiPrompt = `${systemPrompt}\n\nConversation history:\n${historyContext}\n\nUser: ${userMessage}\n\nAssistant:`;
          
          return await callGeminiAPI(geminiPrompt);
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error with AI fallback:', error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
} 