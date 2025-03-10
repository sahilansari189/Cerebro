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

import React, { useEffect, useState } from "react";
import Meta from "../components/Meta";
import { generateResponse, addMessage } from "../chatbot-script.js"; // Import the ES module

const ChatbotScreen = () => {
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    console.log("Chatbot script loaded as module");
  }, []);

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return; // Prevent empty messages

    addMessage(userInput, true); // Show user message
    setUserInput(""); // Clear input field

    // Show typing indicator
    const chatMessages = document.getElementById("chat-messages");
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot-message", "typing-indicator");
    typingIndicator.textContent = "Cerebro is typing...";
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });

    try {
      const response = await generateResponse(userInput);
      chatMessages.removeChild(typingIndicator); // Remove typing indicator
      addMessage(response, false); // Show bot response
    } catch (error) {
      console.error("Error generating response:", error);
      chatMessages.removeChild(typingIndicator);
      addMessage("Sorry, an error occurred. Please try again later.", false);
    }
  };

  return (
    <>
      <Meta title="Mental Health Chatbot - Cerebro" description="Chat with our mental health chatbot for support and guidance." />
      
      <section className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
          
          {/* Chatbot Header */}
          <div className="chat-header flex justify-between items-center bg-blue-500 text-white p-4 rounded-t-lg">
            <h1 className="text-lg font-semibold">Mental Health Chatbot</h1>
          </div>

          {/* Chat Messages */}
          <div id="chat-messages" className="chat-messages h-80 overflow-y-auto p-4 bg-gray-50 border border-gray-300 rounded-lg"></div>

          {/* Chat Input */}
          <div className="chat-input-container flex items-center p-4 bg-gray-200 rounded-b-lg">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg resize-none"
            ></textarea>
            <button onClick={handleSendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatbotScreen;
