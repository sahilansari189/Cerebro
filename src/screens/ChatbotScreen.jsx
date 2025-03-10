/*
import React from "react";
import Meta from "../components/Meta";

const ChatbotScreen = () => {
  return (
    <>
      <Meta 
        title="Chatbots - Cerebro"
        description="Book Chatbots with mental health professionals with ChatBot."
        keywords="Chatbots, mental health, professionals"
      />

      <section className="min-h-screen h-auto flex flex-col justify-center items-center">
        <div className="py-auto px-4 mx-auto  text-center lg:py-16 lg:px-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:my-4 my-5  text-black">
            Make your Appoinment Now!
          </h1>
          <div className="flex-1 overflow-y-auto p-4 border border-gray-300 rounded-lg">
            <iframe
              className="w-full h-96 border-0 rounded-lg shadow-lg overflow-hidden"
              allow="microphone;"
              src="https://console.dialogflow.com/api-client/demo/embedded/561aa08d-9bbb-4ef3-8d65-8a7e8eefccff"></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatbotScreen;
*/

import React, { useEffect, useState, useRef } from "react";
import Meta from "../components/Meta";
import { generateResponse, addMessage } from "../chatbot-script.js";

const ChatbotScreen = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message when component mounts
    setTimeout(() => {
      setMessages([
        {
          text: "Hello! I'm Cerebro, your mental health assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return; // Prevent empty messages

    const userMessage = {
      text: userInput,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update messages with user input
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput(""); // Clear input field
    setIsTyping(true); // Show typing indicator

    try {
      const response = await generateResponse(userInput);
      
      // Add bot response after a small delay to simulate typing
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prevMessages => [
          ...prevMessages, 
          {
            text: response,
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }, 1000);
    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          text: "Sorry, an error occurred. Please try again later.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  return (
    <>
      <Meta title="Mental Health Chatbot - Cerebro" description="Chat with our mental health chatbot for support and guidance." />
      
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          
          {/* Chatbot Header */}
          <div className="chat-header flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl font-bold">C</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Cerebro Assistant</h1>
              <p className="text-xs text-blue-100">Mental Health Support</p>
            </div>
            <div className="ml-auto flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
              <span className="text-xs">Online</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                )}
                <div 
                  className={`message-content max-w-[80%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </div>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 flex-shrink-0">
                    <span className="text-gray-600 text-xs">You</span>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg rounded-tl-none">
                  <div className="typing-indicator flex space-x-1">
                    <div className="dot w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="dot w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="dot w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-container flex items-center p-4 bg-white border-t border-gray-200">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
            ></textarea>
            <button 
              onClick={handleSendMessage} 
              disabled={userInput.trim() === ""}
              className={`ml-3 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                userInput.trim() === "" 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatbotScreen;
