// Rules-based scheme eligibility — real criteria, no AI.
// Sources: scheme guidelines as published on pmkisan.gov.in, pmfby.gov.in,
// soilhealth.dac.gov.in. Simplified to what we can check from farmer input.

export type EligibilityInput = {
  landAcres: number;
  crop: string; // "" if not selected
  state: string; // free-text district/state hint, used for notes only
};

export type SchemeResult = {
  name: string;
  benefit: string;
  eligible: boolean;
  reason: string;
  link: string;
};

export function checkEligibility(input: EligibilityInput): SchemeResult[] {
  const { landAcres, crop } = input;
  const hasLand = landAcres > 0;

  return [
    {
      name: "PM-Kisan Samman Nidhi",
      benefit: "₹6,000/year income support, paid in three instalments.",
      eligible: hasLand,
      reason: hasLand
        ? "All landholding farmer families qualify (land record in your name required)."
        : "Requires cultivable land registered in your family's name.",
      link: "https://pmkisan.gov.in",
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      benefit: "Crop insurance with premium capped at 1.5–5% for farmers.",
      eligible: hasLand && Boolean(crop),
      reason:
        hasLand && crop
          ? `Growing a notified crop (${crop}) on your own land qualifies you.`
          : "Requires land and a notified crop for your district's current season.",
      link: "https://pmfby.gov.in",
    },
    {
      name: "Soil Health Card Scheme",
      benefit: "Free soil testing and fertilizer recommendations every 2 years.",
      eligible: true,
      reason: "Open to all farmers — no land or crop conditions.",
      link: "https://soilhealth.dac.gov.in",
    },
    {
      name: "Kisan Credit Card",
      benefit: "Crop loans up to ₹3 lakh at subsidised interest.",
      eligible: hasLand,
      reason: hasLand
        ? "Landholding cultivators can apply at any bank branch."
        : "Requires land records or a registered tenancy/sharecropping agreement.",
      link: "https://www.myscheme.gov.in/schemes/kcc",
    },
    {
      name: "PM Kisan Maandhan Yojana (pension)",
      benefit: "₹3,000/month pension after age 60.",
      eligible: hasLand && landAcres <= 5,
      reason:
        hasLand && landAcres <= 5
          ? "Small and marginal farmers (up to 2 ha / ~5 acres) aged 18–40 can enrol."
          : "Only small and marginal farmers holding up to 2 hectares (~5 acres) qualify.",
      link: "https://maandhan.in",
    },
  ];
}
