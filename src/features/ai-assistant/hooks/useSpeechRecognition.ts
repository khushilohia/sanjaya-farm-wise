import { useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
  interface SpeechRecognitionInstance extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
  }
  interface SpeechRecognitionResultEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}

export type SpeechError =
  | "not-supported"
  | "permission-denied"
  | "no-speech"
  | "network"
  | "unknown";

const LANG_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ne: "ne-NP",
  bn: "bn-IN",
};

export function useSpeechRecognition(lang: string) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechError | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition ?? window.webkitSpeechRecognition);

  const start = useCallback(async (): Promise<boolean> => {
    setError(null);

    if (!isSupported) {
      setError("not-supported");
      return false;
    }

    // Request mic permission explicitly — release the stream immediately after
    // so it doesn't block the Web Speech API from opening its own mic handle
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setError("permission-denied");
      return false;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = LANG_MAP[lang] ?? "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: SpeechRecognitionResultEvent) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError("permission-denied");
      } else if (e.error === "no-speech") {
        setError("no-speech");
      } else if (e.error === "network") {
        setError("network");
      } else {
        setError("unknown");
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    setTranscript("");
    setIsListening(true);
    recognition.start();
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isSupported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { transcript, isListening, error, isSupported, start, stop, clearError };
}
