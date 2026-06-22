import { useState, useRef, useCallback } from "react";
import { transcribeAudio } from "@/api/serverFns";

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

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? ""); // strip "data:...;base64,"
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Unified voice input.
 *  - Chrome / Android: instant streaming Web Speech API.
 *  - Everywhere else (Safari, Firefox): records the mic and transcribes via
 *    Sarvam speech-to-text on the server, so voice works cross-browser.
 *
 * `onFinalTranscript` fires once per utterance with the recognised text.
 */
export function useVoiceInput(
  lang: string,
  onFinalTranscript: (text: string) => void
) {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<SpeechError | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const webSpeechSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition ?? window.webkitSpeechRecognition);

  const emit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (trimmed) onFinalTranscript(trimmed);
    },
    [onFinalTranscript]
  );

  const start = useCallback(async (): Promise<boolean> => {
    setError(null);
    setInterim("");

    // --- Path A: Web Speech API (fast, streaming) ---
    if (webSpeechSupported) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop()); // release so Web Speech can grab its own
      } catch {
        setError("permission-denied");
        return false;
      }

      const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
      const recognition = new SR();
      recognition.lang = LANG_MAP[lang] ?? "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      let finalText = "";
      recognition.onresult = (e: SpeechRecognitionResultEvent) => {
        let interimText = "";
        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalText += res[0].transcript;
          else interimText += res[0].transcript;
        }
        setInterim(interimText || finalText);
      };
      recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed")
          setError("permission-denied");
        else if (e.error === "no-speech") setError("no-speech");
        else if (e.error === "network") setError("network");
        else setError("unknown");
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
        setInterim("");
        emit(finalText);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
      return true;
    }

    // --- Path B: MediaRecorder + Sarvam STT (cross-browser) ---
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size === 0) {
          setError("no-speech");
          return;
        }
        setIsTranscribing(true);
        try {
          const base64 = await blobToBase64(blob);
          const result = await transcribeAudio({
            data: { audioBase64: base64, mimeType, language: lang },
          });
          if (result.transcript?.trim()) emit(result.transcript);
          else setError("no-speech");
        } catch {
          setError("network");
        } finally {
          setIsTranscribing(false);
        }
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
      return true;
    } catch {
      setError("permission-denied");
      return false;
    }
  }, [lang, webSpeechSupported, emit]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isListening,
    isTranscribing,
    interim,
    error,
    isSupported: true, // always — Sarvam covers non-Chrome browsers
    start,
    stop,
    clearError,
  };
}
