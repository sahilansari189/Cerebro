const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = import.meta.env.VITE_GEMINI_API_URL;

console.log("Loaded API_KEY:", API_KEY);
console.log("Loaded API_URL:", API_URL);

export async function generateResponse(prompt) {
    try {
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

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (data && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text || "No response available.";
        } else {
            return "No valid response received.";
        }
    } catch (error) {
        console.error("Error:", error);
        return "Our servers are currently busy. Please try again later.";
    }
}

export function addMessage(message, isUser) {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", isUser ? "user-message" : "bot-message");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = message;

    const timestamp = document.createElement("div");
    timestamp.classList.add("message-timestamp");
    timestamp.textContent = new Date().toLocaleTimeString();

    messageElement.appendChild(messageContent);
    messageElement.appendChild(timestamp);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
}