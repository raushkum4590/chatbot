"use client";
import React from "react";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  const questions = [
    "What programs do you offer?",
    "How can I apply for admission?",
    "What are the eligibility criteria?",
    "What facilities do you have?",
    "Can I get a scholarship?",
    "What is the application deadline?",
  ];

  return (
    <div className="py-3 px-4 border-t border-gray-200 bg-white">
      <p className="text-xs text-gray-500 mb-2 font-medium">Suggested questions:</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="text-sm text-left bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-800 py-2 px-4 rounded-lg transition-all duration-200 border border-blue-200 shadow-sm hover:shadow w-full"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
