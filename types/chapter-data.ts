export type GameState = {
  trust: number;       // Kepercayaan Warga
  treasury: number;    // Kas Desa / Ekonomi
  stability: number;   // Stabilitas Politik
  legacy: number;      // Warisan Budaya & Ekologi

  completedChapters?: number[]; // Bab yang sudah diselesaikan
  lastSaved?: number;           // Timestamp terakhir disimpan
};

export type Choice = {
  text: string;
  nextId: string;
  effect?: Partial<GameState>;
};

// Flat structure — tidak ada nested `data` wrapper
export type ChapterData = {
  id: string;
  backgroundImage?: string;
  characterImage?: string;
  characterName: string;
  text: string;
  nextSceneId?: string;
  choices?: Choice[];
};

// Metadata per chapter untuk keperluan menu / HUD
export type ChapterMeta = {
  id: string;            // Prefix scene id, e.g. "ch4"
  title: string;         // Judul chapter
  subtitle?: string;     // Sub-judul / konsep matematika
  startSceneId: string;  // Scene pertama chapter ini
};

export type EndingId =
  | "ch1_A1" | "ch1_A2" | "ch1_B1" | "ch1_B2" 
  | "ch2_A1" | "ch2_A2" | "ch2_B1" | "ch2_B2"
  | "ch3_A1" | "ch3_A2" | "ch3_B1" | "ch3_B2"
  | "ch4_A1" | "ch4_A2" | "ch4_B1" | "ch4_B2"
  | "ch5_A1" | "ch5_A2" | "ch5_B1" | "ch5_B2"
  | "unknown";

export type EndingDef = {
  id: EndingId;
  title: string;
  subtitle: string;
  description: string;
  effects: { label: string; value: string; positive: boolean }[];
  bgClass: string;       // Tailwind gradient for card background
  borderClass: string;   // Tailwind border colour
  accentClass: string;   // For title
  badgeLabel: string;
  badgeBg: string;
  icon: string;
};

