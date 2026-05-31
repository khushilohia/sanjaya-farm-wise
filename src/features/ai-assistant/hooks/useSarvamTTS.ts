import { useCallback } from "react";
import { sarvamTTS } from "@/api/serverFns";

const LANG_MAP: Record<string, string> = {
  hi: "hi-IN",
  ne: "ne-NP",
  bn: "bn-IN",
  en: "en-IN",
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

function browserSpeak(text: string, language: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[language] ?? "en-IN";
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // never hang on error
    speechSynthesis.cancel(); // clear queue
    speechSynthesis.speak(utterance);
    // Safety fallback: resolve after duration estimate so we never block
    setTimeout(resolve, Math.max(3000, text.length * 70));
  });
}

async function playBase64Audio(base64: string): Promise<void> {
  const audio = new Audio(`data:audio/wav;base64,${base64}`);
  await audio.play();
  return withTimeout(
    new Promise<void>((resolve) => {
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
    }),
    20_000
  );
}

export function useSarvamTTS() {
  const speak = useCallback(async (text: string, language: string) => {
    try {
      const result = await withTimeout(
        sarvamTTS({ data: { text, language } }),
        30_000 // longer timeout for chunked requests
      );
      if (result.audios && result.audios.length > 0) {
        for (const audioBase64 of result.audios) {
          try {
            await playBase64Audio(audioBase64);
          } catch {
            // chunk playback failed — skip to next chunk
          }
        }
        return;
      }
    } catch {
      // Sarvam unavailable or timed out — fall through to browser TTS
    }
    await browserSpeak(text, language);
  }, []);

  return { speak };
}
