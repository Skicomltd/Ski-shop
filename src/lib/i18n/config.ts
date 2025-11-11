export const locales = ["ng", "pcm"] as const;
// export const locales = ["ng", "yo", "ig", "ha", "pcm"] as const;
export const defaultLocale = "ng" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ng: "English (Nigeria)",
  // yo: "Yorùbá",
  // ig: "Igbo",
  // ha: "Hausa",
  pcm: "Naija Pidgin",
};

export const localeFlags: Record<Locale, string> = {
  ng: "🇳🇬",
  // yo: "🇳🇬",
  // ig: "🇳🇬",
  // ha: "🇳🇬",
  pcm: "🇳🇬",
};

export const currencies: Record<Locale, string> = {
  ng: "NGN",
  // yo: "NGN",
  // ig: "NGN",
  // ha: "NGN",
  pcm: "NGN",
};

export const dateFormats: Record<Locale, Intl.DateTimeFormatOptions> = {
  ng: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  // yo: {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // },
  // ig: {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // },
  // ha: {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // },
  pcm: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
};

export const numberFormats: Record<Locale, Intl.NumberFormatOptions> = {
  ng: {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  // yo: {
  //   style: "decimal",
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // },
  // ig: {
  //   style: "decimal",
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // },
  // ha: {
  //   style: "decimal",
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // },
  pcm: {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
};
