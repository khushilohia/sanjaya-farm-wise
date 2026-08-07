import { useCallback, useRef } from "react";
import { sarvamTTS } from "@/backend/api/serverFns";

const LANG_MAP: Record<string, string> = {
  hi: "hi-IN",
  ne: "ne-NP",
  bn: "bn-IN",
  en: "en-IN",
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export function useSarvamTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Bumped on every stop() and every new speak() call. A speak() call checks
  // its own captured token before touching state/audio, so a stale call from
  // a previous question can never play over — or interleave with — a newer
  // one (which is what caused two different voices to overlap mid-answer).
  const genRef = useRef(0);
  // Resolves whichever playBase64 is currently in flight the instant we stop
  // it, so a superseded call doesn't hang around until its own 25s timeout.
  const stopCurrentRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    genRef.current++;
    stopCurrentRef.current?.();
    stopCurrentRef.current = null;
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
        stopCurrentRef.current = resolve;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      }),
      25_000,
    );
  }, []);

  const browserSpeak = useCallback((text: string, language: string): Promise<void> => {
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
  }, []);

  const speak = useCallback(
    async (text: string, language: string, onChunk?: (chunkText: string) => void) => {
      // Interrupt whatever the previous call was doing before starting —
      // otherwise two speak() calls (e.g. a live-talk question fired while
      // the last answer was still playing) run their loops concurrently and
      // you hear both voices at once.
      stop();
      const myGen = genRef.current;
      const isCurrent = () => myGen === genRef.current;

      try {
        const result = await withTimeout(sarvamTTS({ data: { text, language } }), 30_000);
        if (result.audios && result.audios.length > 0) {
          const texts = result.texts ?? [];
          for (let i = 0; i < result.audios.length; i++) {
            if (!isCurrent()) return;
            // Reveal this chunk's text right as its audio starts, not the
            // full answer up front — keeps the on-screen line in step with
            // what's actually being spoken.
            onChunk?.(texts[i] ?? "");
            try {
              await playBase64(result.audios[i]);
            } catch {
              /* skip failed chunk */
            }
          }
          return;
        }
      } catch {
        /* Sarvam unavailable — fall back to browser TTS, for the whole
           answer, never mid-way through Sarvam playback */
      }
      if (isCurrent()) {
        onChunk?.(text);
        await browserSpeak(text, language);
      }
    },
    [stop, playBase64, browserSpeak],
  );

  return { speak, stop };
}
