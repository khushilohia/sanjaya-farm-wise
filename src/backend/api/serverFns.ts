import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const LANG_LABELS: Record<string, string> = {
  hi: "Hindi",
  ne: "Nepali",
  bn: "Bengali",
  en: "English",
};

const SARVAM_LANG: Record<string, string> = {
  hi: "hi-IN",
  ne: "ne-NP",
  bn: "bn-IN",
  en: "en-IN",
};

function langLabel(code: string): string {
  return LANG_LABELS[code] ?? "English";
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Gemini 2.5 Flash returns answer text directly (no mandatory hidden "reasoning"
// budget that silently eats the whole token allowance like gemini-3.5-flash did).
const CHAT_MODEL = "google/gemini-2.5-flash";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};

async function callOpenRouter(
  messages: ChatMessage[],
  opts: { maxTokens?: number; model?: string } = {},
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("AI is not configured (missing OPENROUTER_API_KEY).");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://sanjaya.farm",
      "X-Title": "Sanjaya Farm AI",
    },
    body: JSON.stringify({
      model: opts.model ?? CHAT_MODEL,
      messages,
      max_tokens: opts.maxTokens ?? 1000,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`AI service error ${res.status}: ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
    error?: { message?: string };
  };

  if (json.error) throw new Error(json.error.message ?? "AI service error");

  const content = json.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new Error("AI returned an empty response. Please try again.");
  }
  return content.trim();
}

// ---------------------------------------------------------------------------
// AI chat — Sanjaya assistant (multi-turn aware)
// ---------------------------------------------------------------------------

export const askAI = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      question: z.string().min(1),
      context: z.string().default(""),
      language: z.string().default("en"),
      // Optional prior turns for conversational memory: [{role, content}, ...]
      history: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          }),
        )
        .max(12)
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    const systemPrompt = `You are Sanjaya, a friendly AI farming assistant for smallholder farmers in Northeast India and Nepal. You talk like a helpful village agriculture officer having a real conversation.

LANGUAGE: Always reply in ${langLabel(data.language)}.

STYLE: Keep answers SHORT, SIMPLE and PRECISE — usually two to four sentences. Use plain everyday words a farmer with little schooling understands. Speak naturally with NO markdown, NO bullet symbols, NO asterisks or hashes, because your reply is read aloud by a voice. Give the one or two most important things to do, not a long lecture. Mention exact quantities, timing or amounts only when they are the answer to the question.

CROSS-QUESTION LIKE A CHATBOT: If the farmer's question is vague or missing a key detail you need to answer well — such as which crop, the growth stage, the symptoms, the area, or what they already tried — do NOT guess. Ask ONE short, simple follow-up question to get that detail, then stop and wait. Only give a full answer once you have enough to be useful. When the farm context below already tells you the crop, soil, or weather, USE it and don't re-ask for it.

USE THE CONTEXT: The farm context may include the farmer's crops, soil test numbers, today's live weather, current mandi prices, and government schemes they qualify for. Tailor your advice to it — for example warn about disease risk if it is rainy and humid, or advise irrigation if it is hot and dry. Refer to their actual crops by name.

BE A PROACTIVE ADVISOR, NOT JUST AN ANSWER MACHINE. This is your most important rule. When the farmer asks about growing, planting or selling a crop, you MUST first check that crop against the farm context: the mandi price trend, the soil pH and texture, and the coming weather. If any of these shows a real problem — price trend down, soil clearly unsuitable, heavy rain or heat ahead — START your answer by saying that problem plainly in one sentence, and suggest one better alternative from the context with its reason (for example a crop whose price trend is up). Then still answer their question for their exact soil and weather, because the choice is theirs. If nothing in the context is against it, just answer. When your advice involves seeds, new crops, money, loans or crop loss risk, end with one short line pointing to a matching government scheme from the context (like PMFBY crop insurance or a Kisan Credit Card loan). Only use prices, trends and schemes that are actually in the context — never invent them.

If you genuinely don't know something, say so honestly in one line and suggest who they could ask locally.

Farm context: ${data.context || "General farming, Northeast India / Nepal hill region."}`;

    const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }];
    for (const turn of data.history ?? []) {
      messages.push({ role: turn.role, content: turn.content });
    }
    messages.push({ role: "user", content: data.question });

    const answer = await callOpenRouter(messages, { maxTokens: 600 });
    return { answer };
  });

// ---------------------------------------------------------------------------
// Speech-to-text (Sarvam) — cross-browser voice input
// ---------------------------------------------------------------------------

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      // base64-encoded audio (no data: prefix), recorded by the browser
      audioBase64: z.string().min(1),
      mimeType: z.string().default("audio/webm"),
      language: z.string().default("en"),
    }),
  )
  .handler(async ({ data }) => {
    const key = process.env.SARVAM_AI_API_KEY;
    if (!key) throw new Error("Speech recognition is not configured.");

    const bytes = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
    const ext = data.mimeType.includes("wav")
      ? "wav"
      : data.mimeType.includes("mp3")
        ? "mp3"
        : "webm";
    const blob = new Blob([bytes], { type: data.mimeType });

    const form = new FormData();
    form.append("file", blob, `audio.${ext}`);
    form.append("model", "saarika:v2.5");
    // Sarvam accepts "unknown" for auto-detect, or a specific BCP-47 code.
    form.append("language_code", SARVAM_LANG[data.language] ?? "unknown");

    const res = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: { "api-subscription-key": key },
      body: form,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Speech service error ${res.status}: ${detail.slice(0, 160)}`);
    }

    const json = (await res.json()) as {
      transcript?: string;
      language_code?: string;
    };
    return {
      transcript: json.transcript ?? "",
      detectedLanguage: json.language_code ?? null,
    };
  });

// ---------------------------------------------------------------------------
// Text-to-speech (Sarvam) — chunked for long answers
// ---------------------------------------------------------------------------

function splitIntoChunks(text: string, maxLen = 480): string[] {
  const sentences = text.match(/[^.!?।]+[.!?।]+|\S+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      // a single sentence longer than maxLen — hard-split it
      if (sentence.length > maxLen) {
        for (let i = 0; i < sentence.length; i += maxLen) {
          chunks.push(sentence.slice(i, i + maxLen).trim());
        }
        current = "";
      } else {
        current = sentence;
      }
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, maxLen)];
}

export const sarvamTTS = createServerFn({ method: "POST" })
  .inputValidator(z.object({ text: z.string().min(1), language: z.string() }))
  .handler(async ({ data }) => {
    const key = process.env.SARVAM_AI_API_KEY;
    if (!key) throw new Error("Text-to-speech is not configured.");

    const targetLang = SARVAM_LANG[data.language] ?? "en-IN";
    const chunks = splitIntoChunks(data.text);

    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const r = await fetch("https://api.sarvam.ai/text-to-speech", {
          method: "POST",
          headers: {
            "api-subscription-key": key,
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
        });
        if (!r.ok) return null;
        const j = (await r.json()) as { audios?: string[] };
        return j.audios?.[0] ?? null;
      }),
    );

    const audios = results.filter((a): a is string => Boolean(a));
    if (audios.length === 0) {
      // Surface failure so the client can use its browser-TTS fallback.
      throw new Error("Text-to-speech returned no audio.");
    }
    return { audios };
  });

// ---------------------------------------------------------------------------
// Crop disease detection — real AI vision analysis (Gemini 2.5 Flash)
// ---------------------------------------------------------------------------

export const detectDisease = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      // full data URL, e.g. "data:image/jpeg;base64,...."
      imageDataUrl: z.string().min(1),
      crop: z.string().default(""),
      language: z.string().default("en"),
    }),
  )
  .handler(async ({ data }) => {
    const cropHint = data.crop ? `The farmer says this is a ${data.crop} plant. ` : "";
    const prompt = `You are an expert agricultural plant pathologist for Northeast India and Nepal. ${cropHint}Look at this plant photo and diagnose any disease, pest, or nutrient deficiency.
Respond ONLY with a valid minified JSON object, no markdown fences, with exactly these keys:
{"isPlant":boolean,"crop":string,"disease":string,"confidence":number(0-100),"severity":"Low"|"Medium"|"High","summary":string,"organicTreatment":string,"chemicalTreatment":string,"prevention":string}
Write "disease" as "Healthy" if no problem is visible. Write all human-readable text fields ("summary","organicTreatment","chemicalTreatment","prevention") in ${langLabel(data.language)}. If the image is not a plant, set isPlant=false and explain in summary.`;

    const raw = await callOpenRouter(
      [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      { maxTokens: 900 },
    );

    // Gemini sometimes wraps JSON in ```json fences — strip them.
    const cleaned = raw
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    const match = cleaned.match(/\{[\s\S]*\}/);

    try {
      const parsed = JSON.parse(match ? match[0] : cleaned);
      return { ok: true as const, report: parsed, raw };
    } catch {
      // Fall back to returning the prose so the UI can still show something.
      return { ok: false as const, report: null, raw };
    }
  });

// ---------------------------------------------------------------------------
// Soil health — real SoilGrids (ISRIC) data by coordinates
// ---------------------------------------------------------------------------

type SoilLayer = {
  name: string;
  unit_measure: { d_factor: number; target_units: string; mapped_units: string };
  depths: { label: string; values: { mean: number | null } }[];
};

export const fetchSoilData = createServerFn({ method: "POST" })
  .inputValidator(z.object({ lat: z.number(), lon: z.number() }))
  .handler(async ({ data }) => {
    const props = ["phh2o", "nitrogen", "soc", "clay", "sand", "silt", "cec"];
    const query =
      props.map((p) => `property=${p}`).join("&") + "&depth=0-5cm&depth=5-15cm&value=mean";
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${data.lon}&lat=${data.lat}&${query}`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`Soil service error ${res.status}`);
    }
    const json = (await res.json()) as {
      properties?: { layers?: SoilLayer[] };
    };

    const layers = json.properties?.layers ?? [];
    const read = (name: string): number | null => {
      const layer = layers.find((l) => l.name === name);
      if (!layer) return null;
      const top = layer.depths[0]?.values?.mean;
      if (top == null) return null;
      return top / (layer.unit_measure?.d_factor ?? 1);
    };

    const ph = read("phh2o"); // pH
    const nitrogen = read("nitrogen"); // g/kg
    const soc = read("soc"); // g/kg organic carbon
    const clay = read("clay"); // %
    const sand = read("sand"); // %
    const silt = read("silt"); // %
    const cec = read("cec"); // cmol/kg

    // Derive a simple soil texture class
    let texture = "Unknown";
    if (clay != null && sand != null && silt != null) {
      if (clay >= 40) texture = "Clay";
      else if (sand >= 70) texture = "Sandy";
      else if (silt >= 50) texture = "Silty";
      else if (clay >= 27) texture = "Clay loam";
      else texture = "Loam";
    }

    // Simple health score (0-100) from pH proximity to neutral + organic carbon + nitrogen
    let score = 50;
    if (ph != null) score += Math.max(0, 20 - Math.abs(ph - 6.5) * 12);
    if (soc != null) score += Math.min(20, soc * 1.2);
    if (nitrogen != null) score += Math.min(10, nitrogen * 6);
    const healthScore = Math.round(Math.max(0, Math.min(100, score)));

    return {
      coordinates: { lat: data.lat, lon: data.lon },
      ph,
      nitrogen,
      organicCarbon: soc,
      clay,
      sand,
      silt,
      cec,
      texture,
      healthScore,
    };
  });

// AI-generated soil interpretation + crop suitability (uses real soil numbers)
export const interpretSoil = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      soil: z.record(z.string(), z.any()),
      crops: z.array(z.string()).default([]),
      language: z.string().default("en"),
    }),
  )
  .handler(async ({ data }) => {
    const s = data.soil as Record<string, number | string | null>;
    const cropLine = data.crops.length ? `The farmer grows: ${data.crops.join(", ")}. ` : "";
    const prompt = `You are a soil scientist. Real measured soil data for a farm: pH ${s.ph}, nitrogen ${s.nitrogen} g/kg, organic carbon ${s.organicCarbon} g/kg, clay ${s.clay}%, sand ${s.sand}%, silt ${s.silt}%, texture ${s.texture}. ${cropLine}
Respond ONLY with minified JSON, no markdown fences:
{"summary":string,"recommendations":string[],"suitability":[{"crop":string,"rating":"Excellent"|"Good"|"Moderate"|"Poor","note":string}]}
Give 3-4 practical recommendations and rate 4-5 crops suitable for this hill-region soil (include the farmer's crops if given). All text in ${langLabel(data.language)}.`;

    const raw = await callOpenRouter([{ role: "user", content: prompt }], {
      maxTokens: 800,
    });
    const match = raw.match(/\{[\s\S]*\}/);
    try {
      return { ok: true as const, ...JSON.parse(match ? match[0] : raw) };
    } catch {
      return { ok: false as const, summary: raw, recommendations: [], suitability: [] };
    }
  });

// ---------------------------------------------------------------------------
// Market prices — real Agmarknet (data.gov.in) with AI fallback
// ---------------------------------------------------------------------------

const AGMARK_RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";

export const fetchMarketPrices = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      state: z.string().default(""),
      commodity: z.string().default(""),
      crops: z.array(z.string()).default([]),
      language: z.string().default("en"),
    }),
  )
  .handler(async ({ data }) => {
    const key = process.env.DATA_GOV_IN_API_KEY;

    // 1) Try the live government Agmarknet feed.
    if (key) {
      try {
        const params = new URLSearchParams({
          "api-key": key,
          format: "json",
          limit: "30",
        });
        if (data.state) params.set("filters[state]", data.state);
        if (data.commodity) params.set("filters[commodity]", data.commodity);
        const url = `https://api.data.gov.in/resource/${AGMARK_RESOURCE}?${params.toString()}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const json = (await res.json()) as {
            records?: Array<Record<string, string>>;
          };
          const records = (json.records ?? []).map((r) => ({
            commodity: r.commodity,
            variety: r.variety,
            market: r.market,
            state: r.state,
            district: r.district,
            minPrice: Number(r.min_price) || null,
            maxPrice: Number(r.max_price) || null,
            modalPrice: Number(r.modal_price) || null,
            arrivalDate: r.arrival_date,
            unit: "₹/quintal",
          }));
          if (records.length > 0) {
            return { source: "live" as const, records };
          }
        }
      } catch {
        // fall through to AI estimate
      }
    }

    // 2) Fallback: AI-estimated indicative prices (clearly labelled).
    const crops = data.crops.length
      ? data.crops
      : ["Cardamom", "Ginger", "Large Cardamom", "Turmeric"];
    const prompt = `You are an Indian agricultural market analyst. Give realistic CURRENT indicative wholesale mandi prices (₹ per quintal) for these crops in ${data.state || "Northeast India / Sikkim region"}: ${crops.join(", ")}.
Respond ONLY with minified JSON, no markdown:
{"records":[{"commodity":string,"market":string,"minPrice":number,"maxPrice":number,"modalPrice":number,"trend":"up"|"down"|"stable","note":string}]}
Notes ("note") in ${langLabel(data.language)}. Prices are realistic estimates for current season.`;

    try {
      const raw = await callOpenRouter([{ role: "user", content: prompt }], {
        maxTokens: 700,
      });
      const match = raw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : raw) as {
        records: Array<Record<string, unknown>>;
      };
      const records = (parsed.records ?? []).map((r) => ({
        ...r,
        unit: "₹/quintal",
      }));
      return { source: "estimated" as const, records };
    } catch {
      return { source: "estimated" as const, records: [] };
    }
  });
