
"use client";
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";

interface Message {
  text: string;
  type: "user" | "bot";
  timestamp?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm Grace College's AI assistant. How can I help you with information about our programs, admissions, facilities, or other inquiries?",
      type: "bot",
      timestamp: getCurrentTime(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, type: "user", timestamp: getCurrentTime() }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        cache: "no-store",
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      setMessages((prev) => [...prev, { text: data.response, type: "bot", timestamp: getCurrentTime() }]);

      if (!isOpen) setUnreadCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          type: "bot",
          timestamp: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-white pt-5 pb-5 z-50">
      {/* Full Page Chatbot */}
      <div className="w-full h-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-b from-sky-200 via-white to-sky-100 text-blue-500 p-4 flex items-center">
          <div className="flex-1">
            <h3 className="font-bold">Grace College Assistant</h3>
            <p className="text-xs opacity-75">Engineering Excellence in Tamil Nadu</p>
          </div>
          <button
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          ref={chatContainerRef}
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.text} type={msg.type} />
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-medium mr-2 shadow-sm">
                G
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 flex items-center shadow-sm">
                <div className="flex space-x-1">
                  <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />

        {/* Suggested Questions */}
        <SuggestedQuestions onSelectQuestion={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chatbot;
