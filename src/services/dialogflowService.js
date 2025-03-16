let sessionId = Math.random().toString(36).substring(2, 15);

/**
 * @param {string} text - The user's message
 * @returns {Promise<Object>} - Dialogflow response
 */
export async function sendTextQueryToDialogflow(text) {
  try {

    const response = await fetch('/api/dialogflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sessionId,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending query to Dialogflow:', error);
    return {
      text: "I'm having trouble understanding right now. Could you try again?",
      fallback: true,
    };
  }
}

export function resetDialogflowSession() {
  sessionId = Math.random().toString(36).substring(2, 15);
}