// data/index.ts
// Central registry untuk semua data chapter.
// Tambahkan import chapter baru di sini agar otomatis terdaftar.

import { chapter4Data, CHAPTER_META as CH4_META, ENDINGS as CH4_ENDINGS } from "./chapter-4";
import { chapter5Data, CHAPTER_META as CH5_META, ENDINGS as CH5_ENDINGS } from "./chapter-5";
import type { ChapterData, ChapterMeta, EndingDef, EndingId } from "../types/chapter-data";

// ── STORY DATA ────────────────────────────────────────────────────────────────
// Semua scene dari seluruh chapter dalam satu flat array (lookup by id)
export const allStoryData: ChapterData[] = [
    ...Object.values(chapter4Data),
    ...Object.values(chapter5Data),
];

// ── CHAPTER METADATA ──────────────────────────────────────────────────────────
// Urutan array = urutan tampil di menu
export const CHAPTER_META_LIST: ChapterMeta[] = [
    CH4_META,
    CH5_META,
];

// ── ENDINGS REGISTRY ──────────────────────────────────────────────────────────
// Gabungkan semua ending dari seluruh chapter
// Ending fallback global
const FALLBACK_ENDING: EndingDef = {
    id: "unknown",
    title: "Perjalanan Desa Amanah",
    subtitle: "Setiap keputusan meninggalkan jejak...",
    description:
        "Dari beras bansos, rebutan air, hingga rapat penentuan malam itu — setiap pilihan Bapak telah membentuk wajah Desa Amanah. Inilah akumulasi dari seluruh keputusan yang Bapak buat sebagai pemimpin.",
    effects: [],
    bgClass: "from-slate-900 via-slate-900 to-zinc-950",
    borderClass: "border-slate-600",
    accentClass: "text-slate-300",
    badgeLabel: "PERJALANAN BERLANJUT",
    badgeBg: "bg-slate-700",
    icon: "📖",
};

export const ALL_ENDINGS: Record<EndingId, EndingDef> = {
    ...CH4_ENDINGS,
    ...CH5_ENDINGS,
    unknown: FALLBACK_ENDING,
} as Record<EndingId, EndingDef>;

// Re-export individual modules untuk keperluan khusus
export { chapter4Data, chapter5Data };
export { CH4_META, CH5_META };
