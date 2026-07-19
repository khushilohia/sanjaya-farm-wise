// Crop icon library — emoji icons for crops grown in Northeast India / Nepal.
// Emoji render everywhere (including low-end kiosk devices), need no assets,
// and read instantly for farmers with limited literacy.

const CROP_ICONS: Record<string, string> = {
  cardamom: "🫛",
  "large cardamom": "🫛",
  ginger: "🫚",
  turmeric: "🧡",
  rice: "🌾",
  paddy: "🌾",
  maize: "🌽",
  corn: "🌽",
  wheat: "🌾",
  millet: "🌾",
  potato: "🥔",
  tomato: "🍅",
  chilli: "🌶️",
  chili: "🌶️",
  pepper: "🌶️",
  "black pepper": "⚫",
  onion: "🧅",
  garlic: "🧄",
  cabbage: "🥬",
  cauliflower: "🥦",
  broccoli: "🥦",
  peas: "🫛",
  beans: "🫘",
  soybean: "🫘",
  lentil: "🫘",
  pulses: "🫘",
  mustard: "🌼",
  tea: "🍃",
  "tea leaves": "🍃",
  orange: "🍊",
  mandarin: "🍊",
  banana: "🍌",
  apple: "🍎",
  kiwi: "🥝",
  pineapple: "🍍",
  mango: "🥭",
  guava: "🍈",
  papaya: "🍈",
  sugarcane: "🎋",
  bamboo: "🎍",
  mushroom: "🍄",
  buckwheat: "🌾",
  barley: "🌾",
  squash: "🎃",
  pumpkin: "🎃",
  cucumber: "🥒",
  brinjal: "🍆",
  eggplant: "🍆",
  carrot: "🥕",
  radish: "🥕",
  spinach: "🥬",
  coriander: "🌿",
  "betel leaf": "🌿",
  arecanut: "🌰",
  "areca nut": "🌰",
};

export function cropIcon(name: string): string {
  const key = name.trim().toLowerCase();
  if (CROP_ICONS[key]) return CROP_ICONS[key];
  // partial match: "Ginger (fresh)" → ginger
  const hit = Object.keys(CROP_ICONS).find((k) => key.includes(k));
  return hit ? CROP_ICONS[hit] : "🌱";
}

export function CropIcon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={className} role="img" aria-label={name}>
      {cropIcon(name)}
    </span>
  );
}
