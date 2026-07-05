"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Icon, { IconNames } from "@/components/shared/Icon";

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

  // #9: 用 ref 稳定 callback 引用，避免 recognition 重复初始化
  const onVoiceCompleteRef = useRef(onVoiceComplete);
  const onResultRef = useRef(onResult);
  onVoiceCompleteRef.current = onVoiceComplete;
  onResultRef.current = onResult;
  const isListeningRef = useRef(isListening);
  isListeningRef.current = isListening;

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
          if (onVoiceCompleteRef.current) {
            onVoiceCompleteRef.current(transcript);
          } else if (onResultRef.current) {
            onResultRef.current(transcript);
          }
          setListeningText("");
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setListeningText("");
      };

      recognition.onend = () => {
        if (recognitionRef.current && isListeningRef.current) {
          recognitionRef.current.start();
        }
      };

      return () => {
        recognition.abort();
      };
    }
  }, []);

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
    <div className={`relative group ${className}`}>
      <textarea
        value={displayText}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/70 backdrop-blur-md rounded-3xl px-5 py-4 text-sm text-gray-700 outline-none border border-white/60 focus:border-tianqing/40 focus:bg-white transition-all resize-none shadow-soft hover:shadow-medium"
        rows={4}
        readOnly={isListening}
      />
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        {isListening && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mr-1 animate-pulse">
            <div className="flex gap-1 items-center">
              <span className="w-1 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-[10px] text-red-500 font-medium tracking-wide">聆听中...</span>
          </div>
        )}
        <button
          onClick={toggleListening}
          disabled={!isSupported}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
            isListening
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "bg-white text-tianqing border border-tianqing/10 shadow-sm hover:shadow-md hover:bg-tianqing/5"
          } ${!isSupported ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
          title={isSupported ? (isListening ? "停止录音" : "语音输入") : "浏览器不支持语音输入"}
        >
          <Icon name={isListening ? IconNames.CLOSE : IconNames.VOICE} size={20} />
        </button>
      </div>
    </div>
  );
}