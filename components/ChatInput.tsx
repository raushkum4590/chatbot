"use client";
import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t border-gray-200 p-4 gap-4"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about Grace College of Engineering..."
        className="flex-1 border rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`bg-blue-500 text-white rounded-full py-2 px-6 font-medium ${
          !message.trim() || disabled 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:bg-blue-400"
        }`}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;