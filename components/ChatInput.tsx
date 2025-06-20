"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Smile, Paperclip, Mic, Image, X, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    clearTranscript,
    clearError
  } = useVoiceRecognition();
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Handle voice recognition transcript
  useEffect(() => {
    if (transcript) {
      setMessage(prevMessage => prevMessage + (prevMessage ? ' ' : '') + transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  // Handle voice recognition errors
  useEffect(() => {
    if (voiceError) {
      alert(`Voice recognition error: ${voiceError}`);
      clearError();
    }
  }, [voiceError, clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };  const toggleRecording = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    try {
      await startListening();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  // Mock emojis for the emoji picker
  const emojis = [
    "😊", "😂", "❤️", "🙌", "👍", "🎉", 
    "🤔", "😎", "😍", "🔥", "👏", "✨", 
    "🌟", "💯", "🙏", "😢", "😭", "😡",
    "🤩", "🥳", "🎓", "📚", "🏫", "❓", 
    "🎯", "👨‍🎓", "👩‍🎓", "💻", "📝", "🧠"
  ];
  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 p-3 flex items-end gap-2 relative"
      aria-label="Chat input form"
    >
      {/* Voice recognition status */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 mb-2 bg-red-500 text-white rounded-lg shadow-lg px-3 py-2 z-10 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker */}
      <AnimatePresence>
        {isEmojiPickerOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10"
          >
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-8 h-8 text-xl flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative flex-1 flex items-end bg-white dark:bg-gray-700 rounded-2xl shadow-sm border ${
        isListening 
          ? 'border-red-300 dark:border-red-600 shadow-red-100 dark:shadow-red-900' 
          : 'border-gray-200 dark:border-gray-600'
      } overflow-hidden`}>        <div className="flex items-center p-2 self-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-blue-500 h-8 w-8 rounded-full"
            aria-label="Add emoji"
            disabled={disabled}
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <Smile size={18} />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${
              isListening 
                ? 'text-red-500 hover:text-red-600 animate-pulse' 
                : 'text-gray-500 hover:text-blue-500'
            }`}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            disabled={disabled}
            onClick={toggleRecording}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          
          <div className="relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => {
                // Handle file upload logic here
                console.log(e.target.files?.[0]);
              }} 
            />
          </div>
        </div>
          <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... Speak now!" : "Type a message..."}
          className={`flex-1 max-h-[120px] resize-none overflow-y-auto px-3 py-3 focus:outline-none bg-transparent dark:text-white ${
            isListening ? 'placeholder-red-400' : ''
          }`}
          rows={1}
          disabled={disabled || isListening}
          aria-label="Message input"
        />
        
        <div className="flex items-center p-2 self-end">
          
        </div>
      </div>
      
      <motion.div 
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="submit"
          disabled={!message.trim() && !isRecording || disabled}
          className={`rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-md ${
            isRecording 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
          aria-label={isRecording ? "Send recording" : "Send message"}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">{isRecording ? "Send recording" : "Send"}</span>
        </Button>
      </motion.div>
    </form>
  );
};

export default ChatInput;
