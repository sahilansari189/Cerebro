const API_KEY = 'AIzaSyD4sbrJFPoEdqTkdQzQKXMCjypJCyXdP38';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const themeToggle = document.getElementById('theme-toggle');
const settingsToggle = document.getElementById('settings-toggle');
const settingsPopup = document.getElementById('settings-popup');
const saveSettings = document.getElementById('save-settings');
const cancelSettings = document.getElementById('cancel-settings');
const responseStyleSelect = document.getElementById('response-style');
const focusAreaSelect = document.getElementById('focus-area');

async function generateResponse(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            }),
        });
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'Our servers are currently busy. Please try again later.';
    }
}

function cleanMarkdown(text) {
    return text.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    const timestamp = document.createElement('div');
    timestamp.classList.add('message-timestamp');
    timestamp.textContent = new Date().toLocaleTimeString();

    messageElement.appendChild(messageContent);
    messageElement.appendChild(timestamp);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
}

sendButton.addEventListener('click', async () => {
    const userText = userInput.value.trim();
    if (userText === '') return;

    addMessage(userText, true);
    userInput.value = '';

    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    const typingContent = document.createElement('div');
    typingContent.classList.add('message-content');
    typingContent.textContent = 'Cerebro is typing';
    typingIndicator.appendChild(typingContent);
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });

    const response = await generateResponse(userText);
    chatMessages.removeChild(typingIndicator);

    addMessage(cleanMarkdown(response), false);
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
    }
});

cancelSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('show');
});

saveSettings.addEventListener('click', () => {
    const responseStyle = responseStyleSelect.value;
    const focusArea = focusAreaSelect.value;
    console.log('Saved Settings:', responseStyle, focusArea);
    settingsPopup.classList.remove('show');
});