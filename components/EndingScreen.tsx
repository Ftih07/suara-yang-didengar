"use client";

import { EndingDef, EndingId, GameState } from "@/types/chapter-data";
import { useEffect, useState } from "react";
import { ALL_ENDINGS } from "@/data";

// -------------------------
// Chapter Logic (Skips repeated logic from previous turn)
// ...
// -------------------------

// ─────────────────────────────────────────────────────────────────────────────
//  ENDING DETECTION — per chapter, berdasarkan akumulasi stats
// ─────────────────────────────────────────────────────────────────────────────

function detectCh1Ending(stats: GameState): EndingId {
  const { trust, treasury, stability } = stats;
  // Logika tebak ending Ch 1 dari stats dasar (50)
  if (trust >= 65 && treasury < 50) return "ch1_B1"; // Reformis (Beras dibongkar, kas turun)
  if (trust <= 35 && stability >= 60) return "ch1_A2"; // Birokrat (Beras ditahan, stabil)
  if (stability <= 40 && treasury >= 50) return "ch1_A1"; // Teknokrat (Coret nama, stabil anjlok)
  return "ch1_B2"; // Humanis Karismatik (Default fallback Ch 1)
}

function detectCh2Ending(stats: GameState): EndingId {
  const { trust, treasury, stability } = stats;
  if (treasury <= 35 && stability >= 65) return "ch2_B1"; // Pompa mahal (Kas bocor, stabil damai)
  if (trust <= 40 && stability <= 40) return "ch2_B2"; // Paksa bagi sumur (Trust & stabil hancur)
  if (treasury >= 60 && trust <= 40) return "ch2_A2"; // Pro-sawah (Kas aman, trust hancur)
  return "ch2_A1"; // Pro-warga (Kompensasi waktu)
}

function detectCh3Ending(stats: GameState): EndingId {
  const { treasury, stability, legacy } = stats;
  if (legacy <= 30 && treasury >= 70) return "ch3_B2"; // Oportunis (Jual cepat, warisan hancur)
  if (legacy >= 70 && treasury <= 40) return "ch3_A2"; // Idealis (Tolak pabrik, warisan utuh)
  if (treasury >= 65 && stability <= 45) return "ch3_B1"; // Sewa majemuk (Kas naik, investor ngambek)
  return "ch3_A1"; // Kompromi tebang beringin
}

function detectCh4Ending(stats: GameState): EndingId {
  const { trust, treasury, stability, legacy } = stats;
  if (trust <= 25 && treasury >= 55) return "ch4_B2";
  if (treasury <= 30 && legacy <= 40) return "ch4_B1";
  if (trust >= 65 && stability <= 40) return "ch4_A2";
  if (trust >= 60 && stability >= 52 && legacy >= 50) return "ch4_A1";
  if (trust >= 55 && stability >= 50) return "ch4_A1";
  return "unknown";
}

function detectCh5Ending(stats: GameState): EndingId {
  const { trust, treasury, stability, legacy } = stats;
  if (treasury >= 90 && trust <= 20) return "ch5_A2";
  if (legacy >= 80 && treasury <= 25) return "ch5_B2";
  if (treasury >= 75 && trust >= 70 && legacy <= 30) return "ch5_A1";
  if (trust >= 65 && stability >= 65 && legacy >= 60) return "ch5_B1";
  if (legacy <= 35 && treasury >= 70) return "ch5_A1";
  if (legacy >= 65) return "ch5_B2";
  if (treasury >= 60) return "ch5_A2";
  return "unknown";
}

function detectEndingId(stats: GameState, lastSceneId?: string): EndingId {
  if (lastSceneId?.startsWith("ch1_")) return detectCh1Ending(stats);
  if (lastSceneId?.startsWith("ch2_")) return detectCh2Ending(stats);
  if (lastSceneId?.startsWith("ch3_")) return detectCh3Ending(stats);
  if (lastSceneId?.startsWith("ch4_") || lastSceneId?.startsWith("chA_ending"))
    return detectCh4Ending(stats);
  if (lastSceneId?.startsWith("ch5_") || lastSceneId?.startsWith("chA_end"))
    return detectCh5Ending(stats);
  return "unknown";
}

// ─────────────────────────────────────────────────────────────────────────────
// (Batas copas: Lanjut ke type StatBarProps dan fungsi AnimatedStatBar di kodemu)

// ─────────────────────────────────────────────────────────────────────────────
//  ANIMATED STAT BAR (Updated to classic/book style)
// ─────────────────────────────────────────────────────────────────────────────

type StatBarProps = {
  label: string;
  value: number;
  color: string;
  delay?: number;
};

function AnimatedStatBar({ label, value, color, delay = 0 }: StatBarProps) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 120 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  // Keep color logic but change to serif and deeper colors
  const qualityColor =
    value >= 75
      ? "text-green-700"
      : value >= 45
        ? "text-[#b08d6a]"
        : "text-red-700";

  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-bold text-[#3b2a1a] uppercase tracking-wide font-serif">
          {label}
        </span>
        <span
          className={`text-xl font-black tabular-nums ${qualityColor} font-serif`}
        >
          {value}%
        </span>
      </div>
      {/* Simple bar for book page style */}
      <div className="w-full bg-[#d4bc96]/50 border border-[#b08d6a] h-3 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-inner`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT (Book Page Design)
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  stats: GameState;
  lastSceneId?: string;
  onBackToMenu: () => void;
};

export default function EndingScreen({
  stats,
  lastSceneId,
  onBackToMenu,
}: Props) {
  const endingId = detectEndingId(stats, lastSceneId);
  const ending: EndingDef = ALL_ENDINGS[endingId] || ALL_ENDINGS["unknown"];

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/80 backdrop-blur-md
        transition-opacity duration-700 p-4
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* 1. FRAME BUKU UTAMA (Background langsung ditaruh di sini, overflow-hidden biar rapi) */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#e8d5b5] rounded-xl border-4 border-[#8c5e35] shadow-2xl overflow-hidden">
        {/* Efek Shadow di dalam buku (tetap diam/statis) */}
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.2)] pointer-events-none z-10"></div>

        {/* 2. KONTEN YANG BISA DI-SCROLL */}
        <div
          className="relative z-20 overflow-y-auto px-4 py-8 md:px-12 md:py-10
            [&::-webkit-scrollbar]:w-3.5
            [&::-webkit-scrollbar-track]:bg-[#e8d5b5]
            [&::-webkit-scrollbar-track]:rounded-r-xl
            [&::-webkit-scrollbar-thumb]:bg-[#8c5e35]
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:border-[3px]
            [&::-webkit-scrollbar-thumb]:border-solid
            [&::-webkit-scrollbar-thumb]:border-[#e8d5b5]
            hover:[&::-webkit-scrollbar-thumb]:bg-[#5a4027]
            [scrollbar-width:thin] 
            [scrollbar-color:#8c5e35_#e8d5b5]
          "
        >
          <div className="text-center mb-10">
            <p className="text-[#8c5e35] text-sm md:text-base uppercase tracking-[0.3em] font-bold mb-3 font-serif">
              — Nasib Desa Amanah —
            </p>
            <div className="inline-block text-5xl md:text-6xl mb-4 drop-shadow-md">
              {ending.icon}
            </div>

            <div className="mb-2">
              <div
                className={`inline-block px-4 py-1.5 rounded-sm border border-[#3b2a1a] text-xs font-black tracking-widest ${ending.badgeBg} text-white shadow-sm font-serif`}
              >
                {ending.badgeLabel}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-3 text-[#3b2a1a] font-serif drop-shadow-sm">
              {ending.title}
            </h1>
            <p className="text-[#5a4027] text-sm md:text-base italic font-serif font-semibold">
              {ending.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── LEFT COLUMN: STATS & ICON SUMMARY ── */}
            <div className="space-y-6">
              {/* Pillar Desa Panel (Parchment/book style) */}
              <div className="bg-[#fcedd9] border-2 border-[#b08d6a] rounded-lg p-5 shadow-md">
                <h2 className="text-[#8c5e35] font-black uppercase tracking-widest text-sm mb-5 text-center font-serif border-b-2 border-[#b08d6a] pb-2">
                  Status Akhir Pilar Desa
                </h2>
                <AnimatedStatBar
                  label="Kepercayaan"
                  value={stats.trust}
                  color="bg-blue-600"
                  delay={0}
                />
                <AnimatedStatBar
                  label="Kas Desa"
                  value={stats.treasury}
                  color="bg-yellow-500"
                  delay={150}
                />
                <AnimatedStatBar
                  label="Stabilitas"
                  value={stats.stability}
                  color="bg-green-600"
                  delay={300}
                />
                <AnimatedStatBar
                  label="Warisan"
                  value={stats.legacy}
                  color="bg-purple-600"
                  delay={450}
                />
              </div>

              {/* Detailed Icon Row - from image_7.png */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    label: "Trust",
                    value: stats.trust,
                    color: "text-blue-700",
                    icon: "👥",
                  },
                  {
                    label: "Kas",
                    value: stats.treasury,
                    color: "text-yellow-600",
                    icon: "💰",
                  },
                  {
                    label: "Stabil",
                    value: stats.stability,
                    color: "text-green-700",
                    icon: "⚖️",
                  },
                  {
                    label: "Warisan",
                    value: stats.legacy,
                    color: "text-purple-700",
                    icon: "🌿",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#fcedd9] border border-[#b08d6a] rounded-md p-2 text-center shadow-sm"
                  >
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div
                      className={`text-lg md:text-xl font-black ${s.color} font-serif`}
                    >
                      {s.value}
                    </div>
                    <div className="text-[9px] md:text-[10px] text-[#5a4027] font-bold uppercase tracking-wide mt-1 font-serif">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: ENDING CARD & QUOTE ── */}
            <div className="flex flex-col">
              {/* Ending Card Panel (Book style) */}
              <div className="grow bg-[#fcedd9] border-2 border-[#b08d6a] rounded-lg p-5 md:p-6 shadow-md mb-6">
                <p className="text-[#3b2a1a] leading-relaxed text-base md:text-lg font-serif font-medium mb-6">
                  {ending.description}
                </p>

                {ending.effects.length > 0 && (
                  <>
                    <hr className="border-[#b08d6a] mb-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#8c5e35] mb-4 font-serif">
                      Dampak Keputusan:
                    </h3>
                    <ul className="space-y-3 bullet-serif-brown font-serif">
                      {ending.effects.map((e, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm md:text-base"
                        >
                          <span
                            className={`mt-0.5 shrink-0 font-black ${e.positive ? "text-green-600" : "text-red-600"}`}
                          >
                            {e.positive ? "▲" : "▼"}
                          </span>
                          <span className="font-serif text-[#3b2a1a]">
                            <span className="font-bold">{e.label}:</span>{" "}
                            <span className="text-[#5a4027]">{e.value}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Quote (Parchment book quote style) */}
              <blockquote className="border-l-4 border-[#8c5e35] pl-4 italic text-[#5a4027] text-sm md:text-base font-serif mb-6">
                "Sejarah akan menulis apakah tanganmu membangun surga untuk
                wargamu, atau malah membangun neraka yang indah."
                <footer className="mt-2 text-[#8c5e35] font-bold not-italic text-xs md:text-sm center-attrib">
                  — Mbah Darmo, Sesepuh Desa Amanah
                </footer>
              </blockquote>
            </div>
          </div>

          {/* ── TOMBOL KEMBALI ── (Wood texture style with gold text) */}
          <div className="text-center mt-6">
            <button
              onClick={onBackToMenu}
              className="
                              bg-linear-to-b from-[#8c5e35] to-[#5a4027]
                              hover:from-[#7a502a] hover:to-[#4a331e]
                              text-[#d4bc96] font-black text-lg md:text-xl font-serif
                              px-8 py-3 md:px-12 md:py-4 rounded-lg
                              border-b-4 border-[#3b2a1a]
                              active:border-b-0 active:translate-y-1
                              transition-all shadow-lg tracking-wider
                              text-shadow-md
                            "
            >
              ✦ Kembali ke Menu Utama ✦
            </button>
            <p className="text-[#8c5e35] text-xs mt-3 font-serif">
              Terima kasih telah bermain Suara yang Didengar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
