import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// In-memory user store (MVP)
const users = new Map<
  string,
  {
    id: string;
    name: string;
    phone: string;
    village: string;
    farmSize: string;
    crops: string[];
    language: string;
    passwordHash: string;
  }
>();

export const registerUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string(),
      phone: z.string(),
      village: z.string(),
      farmSize: z.string(),
      crops: z.array(z.string()),
      language: z.string(),
      password: z.string(),
    })
  )
  .handler(async ({ data }) => {
    if (users.has(data.phone)) {
      throw new Error("Phone already registered");
    }
    const id = Math.random().toString(36).slice(2);
    users.set(data.phone, {
      id,
      name: data.name,
      phone: data.phone,
      village: data.village,
      farmSize: data.farmSize,
      crops: data.crops,
      language: data.language,
      passwordHash: data.password,
    });
    const token = btoa(
      JSON.stringify({ id, phone: data.phone, exp: Date.now() + 86400000 })
    );
    return {
      user: {
        id,
        name: data.name,
        phone: data.phone,
        village: data.village,
        farmSize: data.farmSize,
        crops: data.crops,
        language: data.language,
        token,
      },
    };
  });

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ phone: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const stored = users.get(data.phone);
    if (!stored || stored.passwordHash !== data.password) {
      throw new Error("Invalid credentials");
    }
    const token = btoa(
      JSON.stringify({
        id: stored.id,
        phone: data.phone,
        exp: Date.now() + 86400000,
      })
    );
    return {
      user: {
        id: stored.id,
        name: stored.name,
        phone: data.phone,
        village: stored.village,
        farmSize: stored.farmSize,
        crops: stored.crops,
        language: stored.language,
        token,
      },
    };
  });

export const askAI = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      question: z.string(),
      context: z.string(),
      language: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
    const langLabel =
      data.language === "hi"
        ? "Hindi"
        : data.language === "ne"
          ? "Nepali"
          : data.language === "bn"
            ? "Bengali"
            : "English";

    const systemPrompt = `You are Sanjaya, a knowledgeable AI farming assistant for small farmers in Northeast India and Nepal.
Answer in ${langLabel}.
Give complete, thorough, spoken-style answers — explain step by step when the question is about growing, planting, fertilizing, pest control, or harvesting. Use natural spoken language with no bullet points or markdown, as your answer will be read aloud. Cover timing, quantity, methods, and common mistakes where relevant.
Farm context: ${data.context}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sanjaya.farm",
        "X-Title": "Sanjaya Farm AI",
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: data.question },
        ],
        max_tokens: 800,
      }),
    });
    const json = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return {
      answer:
        json.choices?.[0]?.message?.content ??
        "I couldn't process that. Please try again.",
    };
  });

function splitIntoChunks(text: string, maxLen = 490): string[] {
  const chunks: string[] = [];
  // Split on sentence boundaries first
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, maxLen)];
}

export const sarvamTTS = createServerFn({ method: "POST" })
  .inputValidator(z.object({ text: z.string(), language: z.string() }))
  .handler(async ({ data }) => {
    const SARVAM_KEY = process.env.SARVAM_AI_API_KEY;
    const langMap: Record<string, string> = {
      hi: "hi-IN",
      ne: "ne-NP",
      bn: "bn-IN",
      en: "en-IN",
    };
    const targetLang = langMap[data.language] ?? "en-IN";
    const chunks = splitIntoChunks(data.text);

    const results = await Promise.all(
      chunks.map((chunk) =>
        fetch("https://api.sarvam.ai/text-to-speech", {
          method: "POST",
          headers: {
            "api-subscription-key": SARVAM_KEY ?? "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target_language_code: targetLang,
            text: chunk,
            speaker: "anushka",
            pitch: 0,
            pace: 1.0,
            loudness: 1.5,
            model: "bulbul:v2",
            enable_preprocessing: true,
          }),
        }).then((r) => r.json() as Promise<{ audios?: string[] }>)
      )
    );

    const audios = results
      .map((r) => r.audios?.[0] ?? null)
      .filter(Boolean) as string[];
    return { audios };
  });
