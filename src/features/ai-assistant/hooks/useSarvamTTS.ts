import { useCallback, useRef } from "react";
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

export function useSarvamTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelledRef = useRef(false);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }, []);

  const playBase64 = useCallback((base64: string): Promise<void> => {
    return withTimeout(
      new Promise<void>((resolve) => {
        const audio = new Audio(`data:audio/wav;base64,${base64}`);
        audioRef.current = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      }),
      25_000
    );
  }, []);

  const browserSpeak = useCallback(
    (text: string, language: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = LANG_MAP[language] ?? "en-IN";
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          speechSynthesis.cancel();
          speechSynthesis.speak(utterance);
          setTimeout(resolve, Math.max(3000, text.length * 70));
        } catch {
          resolve();
        }
      });
    },
    []
  );

  const speak = useCallback(
    async (text: string, language: string) => {
      cancelledRef.current = false;
      try {
        const result = await withTimeout(
          sarvamTTS({ data: { text, language } }),
          30_000
        );
        if (result.audios && result.audios.length > 0) {
          for (const audioBase64 of result.audios) {
            if (cancelledRef.current) return;
            try {
              await playBase64(audioBase64);
            } catch {
              /* skip failed chunk */
            }
          }
          return;
        }
      } catch {
        /* Sarvam unavailable — fall back to browser TTS */
      }
      if (!cancelledRef.current) await browserSpeak(text, language);
    },
    [playBase64, browserSpeak]
  );

  return { speak, stop };
}
