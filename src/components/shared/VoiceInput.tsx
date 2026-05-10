"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface VoiceInputProps {
  onResult?: (text: string) => void;
  onVoiceComplete?: (text: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: SpeechRecognitionResultList;
    length: number;
  };
}

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

export default function VoiceInput({ onResult, onVoiceComplete, placeholder = "请输入...", className = "", value, onChange }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [listeningText, setListeningText] = useState("");
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    const win = window as unknown as { SpeechRecognition?: { new (): SpeechRecognitionType }; webkitSpeechRecognition?: { new (): SpeechRecognitionType } };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "zh-CN";
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((resultList) => resultList[0].transcript)
          .join("");
        setListeningText(transcript);
        if (event.results[0] && event.results[0][0] && event.results[0][0].isFinal) {
          setIsListening(false);
          if (onVoiceComplete) {
            onVoiceComplete(transcript);
          } else if (onResult) {
            onResult(transcript);
          }
          setListeningText("");
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setListeningText("");
      };

      recognition.onend = () => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.start();
        }
      };

      return () => {
        recognition.abort();
      };
    }
  }, [onResult, onVoiceComplete, isListening]);

  const startListening = useCallback(() => {
    if (!isSupported || isListening) return;
    setIsListening(true);
    recognitionRef.current?.start();
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (!isListening) return;
    setIsListening(false);
    recognitionRef.current?.abort();
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const displayText = isListening ? listeningText : (value || "");

  return (
    <div className={`relative ${className}`}>
      <textarea
        value={displayText}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-yuebai rounded-2xl px-4 py-3 text-sm outline-none border border-tianqing/10 focus:border-tianqing/30 transition-colors resize-none"
        rows={4}
        readOnly={isListening}
      />
      <button
        onClick={toggleListening}
        disabled={!isSupported}
        className={`absolute right-3 bottom-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? "bg-red-100 text-red-500 animate-pulse shadow-lg"
            : "bg-tianqing/10 text-tianqing hover:bg-tianqing/20"
        } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
        title={isSupported ? (isListening ? "停止录音" : "语音输入") : "浏览器不支持语音输入"}
      >
        <span className="text-lg">{isListening ? "⏹️" : "🎤"}</span>
      </button>
      {isListening && (
        <div className="absolute left-3 bottom-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-xs text-gray-400">正在听...</span>
        </div>
      )}
    </div>
  );
}
