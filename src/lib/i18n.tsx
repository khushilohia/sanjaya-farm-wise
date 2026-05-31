import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "ne" | "bn";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
];

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

const TRANSLATIONS = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.assistant": "AI Assistant",
    "nav.weather": "Weather",
    "nav.market": "Market",
    "nav.schemes": "Schemes",
    "hero.tagline": "Your farm's wisest companion.",
    "hero.subtitle": "Voice-first AI farming advice in your language.",
    "hero.cta_primary": "Get started free",
    "hero.cta_voice": "Talk to Sanjaya",
    "voice.prompt": "Ask anything about your farm",
    "voice.listening": "Listening...",
    "voice.supported_langs": "Supported: Hindi, Nepali, Bengali, English",
  },
  hi: {
    "nav.dashboard": "डैशबोर्ड",
    "nav.assistant": "AI सहायक",
    "nav.weather": "मौसम",
    "nav.market": "बाजार",
    "nav.schemes": "योजनाएं",
    "hero.tagline": "आपके खेत का सबसे बुद्धिमान साथी।",
    "hero.subtitle": "आपकी भाषा में आवाज़-पहले AI खेती सलाह।",
    "hero.cta_primary": "मुफ़्त शुरू करें",
    "hero.cta_voice": "संजय से बात करें",
    "voice.prompt": "अपने खेत के बारे में कुछ भी पूछें",
    "voice.listening": "सुन रहा है...",
    "voice.supported_langs": "समर्थित: हिन्दी, नेपाली, बंगाली, अंग्रेज़ी",
  },
  ne: {
    "nav.dashboard": "ड्यासबोर्ड",
    "nav.assistant": "AI सहायक",
    "nav.weather": "मौसम",
    "nav.market": "बजार",
    "nav.schemes": "योजनाहरू",
    "hero.tagline": "तपाईंको खेतको सबैभन्दा बुद्धिमान साथी।",
    "hero.subtitle": "तपाईंको भाषामा आवाज-पहिले AI खेती सल्लाह।",
    "hero.cta_primary": "नि:शुल्क सुरू गर्नुहोस्",
    "hero.cta_voice": "संजयसँग कुरा गर्नुहोस्",
    "voice.prompt": "आफ्नो खेतको बारेमा केही पनि सोध्नुहोस्",
    "voice.listening": "सुनिरहेको छ...",
    "voice.supported_langs": "समर्थित: हिन्दी, नेपाली, बंगाली, अंग्रेज़ी",
  },
  bn: {
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.assistant": "AI সহকারী",
    "nav.weather": "আবহাওয়া",
    "nav.market": "বাজার",
    "nav.schemes": "প্রকল্প",
    "hero.tagline": "আপনার খামারের সবচেয়ে জ্ঞানী সঙ্গী।",
    "hero.subtitle": "আপনার ভাষায় ভয়েস-প্রথম AI কৃষি পরামর্শ।",
    "hero.cta_primary": "বিনামূল্যে শুরু করুন",
    "hero.cta_voice": "সঞ্জয়ের সাথে কথা বলুন",
    "voice.prompt": "আপনার খামার সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন",
    "voice.listening": "শুনছি...",
    "voice.supported_langs": "সমর্থিত: হিন্দি, নেপালি, বাংলা, ইংরেজি",
  },
} as const;

export type TKey = keyof typeof TRANSLATIONS.en;

export function useT() {
  const { lang } = useLang();
  return (key: TKey): string =>
    (TRANSLATIONS[lang] as Record<string, string>)[key] ??
    (TRANSLATIONS.en as Record<string, string>)[key] ??
    key;
}
