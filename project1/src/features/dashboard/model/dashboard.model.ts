export type PlaceType = "Hotel" | "Cafe" | "Apartment";
export type NoiseLevel = "quiet" | "moderate" | "super-noisy";

export interface SoundPlace {
  id: string;
  name: string;
  type: PlaceType;
  address: string;
  decibel: number;
  description: string;
  coordinates: {
    x: number;
    y: number;
  };
  waveSamples: number[];
}

export interface NoiseLevelMeta {
  id: NoiseLevel;
  label: string;
  helper: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const placeTypes: Array<PlaceType | "All types"> = [
  "All types",
  "Hotel",
  "Cafe",
  "Apartment",
];

export const noiseLevels: NoiseLevelMeta[] = [
  {
    id: "quiet",
    label: "Library-quiet",
    helper: "Below 45 dB, calm or low ambient hum",
    colorClass: "text-[#16A34A]",
    bgClass: "bg-[#EAFBF1]",
    borderClass: "border-[#B9F2CE]",
  },
  {
    id: "moderate",
    label: "Moderately noisy",
    helper: "46-62 dB, comfortable conversation",
    colorClass: "text-[#F59E0B]",
    bgClass: "bg-[#FFF7DF]",
    borderClass: "border-[#FDE68A]",
  },
  {
    id: "super-noisy",
    label: "Super noisy",
    helper: "Above 62 dB, high ambient noise",
    colorClass: "text-[#EF4444]",
    bgClass: "bg-[#FFF1F2]",
    borderClass: "border-[#FECACA]",
  },
];

export const soundPlaces: SoundPlace[] = [
  {
    id: "poblacion-heritage-cafe",
    name: "Poblacion Heritage Cafe",
    type: "Cafe",
    address: "F. B. Harrison St, Davao City",
    decibel: 41,
    description:
      "Charming interiors but gets noticeably busier toward the evening. Weekday mornings are the sweet spot for focused work.",
    coordinates: { x: 56, y: 42 },
    waveSamples: [12, 18, 24, 14, 28, 20, 36, 18, 26, 42, 20, 30, 24, 38],
  },
  {
    id: "the-grand-davao-hotel",
    name: "The Grand Davao Hotel",
    type: "Hotel",
    address: "Claro M. Recto St, Davao City",
    decibel: 57,
    description:
      "Lobby traffic is steady during check-in hours, while the upper lounge stays comfortable for casual meetups.",
    coordinates: { x: 74, y: 57 },
    waveSamples: [22, 48, 34, 52, 28, 44, 60, 36, 54, 42, 66, 34, 50, 58],
  },
  {
    id: "skyline-residences",
    name: "Skyline Residences",
    type: "Apartment",
    address: "JP Laurel Ave, Davao City",
    decibel: 68,
    description:
      "Road-facing units pick up traffic bursts during rush hour. Interior courtyards are noticeably softer.",
    coordinates: { x: 65, y: 66 },
    waveSamples: [52, 78, 64, 86, 58, 92, 70, 96, 62, 84, 74, 90, 68, 98],
  },
  {
    id: "brew-and-co",
    name: "Brew & Co.",
    type: "Cafe",
    address: "Iustre St, Davao City",
    decibel: 44,
    description:
      "Compact cafe with low music levels and a quiet back corner that works well for reading or laptop time.",
    coordinates: { x: 47, y: 61 },
    waveSamples: [14, 22, 18, 30, 16, 26, 34, 18, 28, 20, 36, 24, 32, 18],
  },
  {
    id: "buhangin-inn-suites",
    name: "Buhangin Inn & Suites",
    type: "Hotel",
    address: "Buhangin Rd, Davao City",
    decibel: 73,
    description:
      "Close to a busy corridor, so the entrance and cafe area can become loud during peak travel windows.",
    coordinates: { x: 79, y: 35 },
    waveSamples: [58, 88, 72, 96, 64, 102, 78, 92, 70, 106, 82, 98, 74, 110],
  },
  {
    id: "cacao-and-clay-cafe",
    name: "Cacao & Clay Cafe",
    type: "Cafe",
    address: "Magsaysay Park, Davao City",
    decibel: 53,
    description:
      "Usually relaxed, with occasional crowd noise from nearby foot traffic and weekend park activity.",
    coordinates: { x: 82, y: 71 },
    waveSamples: [20, 42, 28, 46, 32, 56, 38, 48, 30, 52, 36, 44, 34, 50],
  },
];

export function getNoiseLevel(decibel: number): NoiseLevel {
  if (decibel <= 45) return "quiet";
  if (decibel <= 62) return "moderate";
  return "super-noisy";
}

export function getNoiseLevelMeta(decibel: number) {
  const level = getNoiseLevel(decibel);
  return noiseLevels.find((item) => item.id === level) ?? noiseLevels[0];
}

export function filterPlaces(
  places: SoundPlace[],
  activeType: PlaceType | "All types",
  activeNoiseLevel: NoiseLevel | "all",
  searchQuery: string,
) {
  const query = searchQuery.trim().toLowerCase();

  return places.filter((place) => {
    const matchesType = activeType === "All types" || place.type === activeType;
    const matchesNoise =
      activeNoiseLevel === "all" || getNoiseLevel(place.decibel) === activeNoiseLevel;
    const matchesSearch =
      !query ||
      place.name.toLowerCase().includes(query) ||
      place.address.toLowerCase().includes(query);

    return matchesType && matchesNoise && matchesSearch;
  });
}
