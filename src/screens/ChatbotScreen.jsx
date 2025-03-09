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

import React, { useEffect } from "react";
import Meta from "../components/Meta";

const ChatbotScreen = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/chatbot-script.js"; //
    script.async = true;
    script.onload = () => console.log("Chatbot script loaded successfully");
    script.onerror = () => console.error("Failed to load chatbot script");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
            <textarea id="user-input" rows="1" placeholder="Type your message..." className="flex-1 p-2 border border-gray-300 rounded-lg resize-none"></textarea>
            <button id="send-button" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>

      </section>
    </>
  );
};

export default ChatbotScreen;