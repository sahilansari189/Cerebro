import React, { useState, useEffect, useRef } from 'react';
import { enhanceWithChatGPT, chatGPTFallback, setActiveModel } from '../services/chatgptService';
import { sendTextQueryToDialogflow } from '../services/dialogflowService';
import testOpenAI from '../test-openai';

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([
    { text: "Hi, I'm Cerebro. How can I help you today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [activeModel, setActiveModelState] = useState('hybrid'); // 'openai', 'gemini', or 'hybrid'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTestOpenAI = async () => {
    setIsLoading(true);
    try {

      setMessages(prev => [...prev, { text: "Testing AI integration...", isUser: false }]);

      const response = await chatGPTFallback("write a haiku about mental health", conversationHistory);
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error("Error testing AI:", error);
      setMessages(prev => [...prev, { 
        text: "Error testing AI integration. Check console for details.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendToDialogflow = async (userMessage) => {
    try {
      const dialogflowResponse = await simulateDialogflowResponse(userMessage);
      
      if (dialogflowResponse.fallback) {
        const chatGPTResponse = await chatGPTFallback(userMessage, conversationHistory);
        return { text: chatGPTResponse, isDialogflowFallback: true };
      }
      
      const enhancedResponse = await enhanceWithChatGPT(
        dialogflowResponse.text, 
        conversationHistory.slice(-3).map(msg => msg.text).join('\n')
      );
      
      return { text: enhancedResponse, isDialogflowFallback: false };
    } catch (error) {
      console.error('Error communicating with Dialogflow:', error);
      return { 
        text: "I'm having trouble processing your request. Please try again later.", 
        isDialogflowFallback: true 
      };
    }
  };

  const simulateDialogflowResponse = async (userMessage) => {

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return { text: "Hello! How are you feeling today?", fallback: false };
    } else if (lowerCaseMessage.includes('feeling') || lowerCaseMessage.includes('mood')) {
      return { text: "It's important to acknowledge your feelings. Can you tell me more about what's going on?", fallback: false };
    } else if (lowerCaseMessage.includes('anxious') || lowerCaseMessage.includes('anxiety')) {
      return { text: "Anxiety can be challenging. Deep breathing exercises might help in the moment.", fallback: false };
    } else if (lowerCaseMessage.includes('sad') || lowerCaseMessage.includes('depressed')) {
      return { text: "I'm sorry to hear you're feeling down. Would you like to talk about what's causing these feelings?", fallback: false };
    } else {
      return { text: "I'm not sure I understand. Could you rephrase that?", fallback: true };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { text: inputText, isUser: true };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);
    
    const response = await sendToDialogflow(inputText);
    
    const botMessage = { text: response.text, isUser: false };
    setMessages(prev => [...prev, botMessage]);
    
    setConversationHistory([...updatedHistory, botMessage]);
    setIsLoading(false);
  };

  const changeModel = (model) => {
    setActiveModelState(model);
    setActiveModel(model); // Update the service
    setMessages(prev => [...prev, { 
      text: `Switched to ${model === 'openai' ? 'OpenAI' : model === 'gemini' ? 'Gemini' : 'Hybrid'} model`, 
      isUser: false 
    }]);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto rounded-lg shadow-lg bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="bg-blue-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
          <div className="flex space-x-2">
            {/* <button
              onClick={handleTestOpenAI}
              disabled={isLoading}
              className="bg-green-500 text-white rounded-md py-1 px-3 text-sm disabled:opacity-50"
            >
              Test AI Integration
            </button> */}
            <div className="flex-1 flex justify-end space-x-1 text-xs">
              <span className="self-center text-gray-500">Model:</span>
              <button
                onClick={() => changeModel('hybrid')}
                className={`px-2 py-1 rounded ${activeModel === 'hybrid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Hybrid
              </button>
              <button
                onClick={() => changeModel('openai')}
                className={`px-2 py-1 rounded ${activeModel === 'openai' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                OpenAI
              </button>
              <button
                onClick={() => changeModel('gemini')}
                className={`px-2 py-1 rounded ${activeModel === 'gemini' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Gemini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface; 