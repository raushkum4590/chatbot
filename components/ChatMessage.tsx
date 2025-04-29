import React from "react";

type MessageType = "user" | "bot";

interface ChatMessageProps {
  message: string;
  type: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type }) => {
  return (
    <div
      className={`flex ${
        type === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md lg:max-w-lg ${
          type === "user" 
            ? "bg-blue-400 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;