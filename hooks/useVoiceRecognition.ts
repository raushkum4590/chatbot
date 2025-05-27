import { useState, useCallback } from 'react';
import { startSpeechRecognition } from '@/app/utils/gemini';

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  clearTranscript: () => void;
  clearError: () => void;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(async () => {
    if (isListening) return;

    setIsListening(true);
    setError(null);

    try {
      const result = await startSpeechRecognition();
      setTranscript(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Speech recognition failed';
      setError(errorMessage);
      console.error('Voice recognition error:', err);
    } finally {
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    clearError,
  };
};
