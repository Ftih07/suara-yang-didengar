"use client";

import { EndingDef, EndingId, GameState } from "@/types/chapter-data";
import { useEffect, useState } from "react";
import { ALL_ENDINGS } from "@/data";

// -------------------------
// Chapter 4 Logic
// -------------------------

// ─────────────────────────────────────────────────────────────────────────────
//  ENDING DETECTION — per chapter, berdasarkan akumulasi stats
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chapter 4: Ketidakpuasan Warga Meledak
 * Deteksi berdasarkan keputusan apa yang membentuk trust & stability:
 *   A1 (Mediasi)       → trust & stability naik, legacy naik
 *   A2 (Referendum)    → trust naik tinggi, tapi stability drop
 *   B1 (Bailout Legal) → treasury turun drastis, legacy turun
 *   B2 (Tangan Besi)   → trust turun drastis, treasury naik
 */
function detectCh4Ending(stats: GameState): EndingId {
    const { trust, treasury, stability, legacy } = stats;

    // B2: trust hancur akibat kekerasan, tapi kas selamat
    if (trust <= 25 && treasury >= 55)
        return "ch4_B2";

    // B1: kas bocor parah akibat bailout, warisan rusak
    if (treasury <= 30 && legacy <= 40)
        return "ch4_B1";

    // A2: trust tinggi (warga salut), tapi stabilitas hancur akibat polarisasi
    if (trust >= 65 && stability <= 40)
        return "ch4_A2";

    // A1: mediasi sukses — trust, stability, legacy semuanya sehat
    if (trust >= 60 && stability >= 52 && legacy >= 50)
        return "ch4_A1";

    // Fallback A1 jika stats positif secara umum
    if (trust >= 55 && stability >= 50)
        return "ch4_A1";

    return "unknown";
}

/**
 * Chapter 5: Satu Keputusan Besar Terakhir
 * Deteksi berdasarkan pilihan korporatisasi vs kemandirian:
 *   A1 (Sosialis-Korporat) → kas meledak, trust tinggi, legacy hancur
 *   A2 (Kapitalis Murni)   → kas max, trust hancur, inequality ekstrem
 *   B1 (Koperasi Mandiri)  → semua pilar positif moderat
 *   B2 (Tradisionalis)     → legacy tinggi, kas minus, stabilitas max
 */
function detectCh5Ending(stats: GameState): EndingId {
    const { trust, treasury, stability, legacy } = stats;

    // A2: kas meledak tapi trust & legacy hancur (oligarki lokal)
    if (treasury >= 90 && trust <= 20)
        return "ch5_A2";

    // B2: legacy & stabilitas sangat tinggi, kas habis (tradisionalis ekstrem)
    if (legacy >= 80 && treasury <= 25)
        return "ch5_B2";

    // A1: kas besar & trust tinggi, tapi legacy rendah (korporat + UBI)
    if (treasury >= 75 && trust >= 70 && legacy <= 30)
        return "ch5_A1";

    // B1: semua pilar seimbang positif (koperasi mandiri)
    if (trust >= 65 && stability >= 65 && legacy >= 60)
        return "ch5_B1";

    // Secondary fallbacks berdasarkan dominant stat
    if (legacy <= 35 && treasury >= 70) return "ch5_A1"; // kaya tapi kehilangan jati diri
    if (legacy >= 65) return "ch5_B2";                   // masih kuat tradisi
    if (treasury >= 60) return "ch5_A2";                  // dominan ekonomi

    return "unknown";
}

function detectEndingId(stats: GameState, lastSceneId?: string): EndingId {
    if (lastSceneId?.startsWith("ch4_") || lastSceneId?.startsWith("chA_ending"))
        return detectCh4Ending(stats);
    if (lastSceneId?.startsWith("ch5_") || lastSceneId?.startsWith("chA_end"))
        return detectCh5Ending(stats);
    return "unknown";
}



// ─────────────────────────────────────────────────────────────────────────────
//  ANIMATED STAT BAR
// ─────────────────────────────────────────────────────────────────────────────

type StatBarProps = {
    label: string;
    value: number;
    color: string;
    delay?: number; // ms animation delay
};

function AnimatedStatBar({ label, value, color, delay = 0 }: StatBarProps) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(value), 120 + delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    const quality =
        value >= 75 ? "text-green-400" :
            value >= 45 ? "text-yellow-400" :
                "text-red-400";

    return (
        <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{label}</span>
                <span className={`text-xl font-black tabular-nums ${quality}`}>{value}</span>
            </div>
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
    stats: GameState;
    lastSceneId?: string; // Untuk keperluan debug / validasi
    onBackToMenu: () => void;
};


export default function EndingScreen({ stats, lastSceneId, onBackToMenu }: Props) {
    const endingId = detectEndingId(stats, lastSceneId);
    const ending: EndingDef = ALL_ENDINGS[endingId] || ALL_ENDINGS["unknown"];

    // Fade-in state
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/95 backdrop-blur-sm
        transition-opacity duration-700
        ${visible ? "opacity-100" : "opacity-0"}
      `}
        >
            {/* Scrollable inner container */}
            <div className="w-full max-w-3xl max-h-[95vh] overflow-y-auto px-4 py-8">

                {/* ── HEADER ── */}
                <div className="text-center mb-8">
                    <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mb-2">
                        — Nasib Desa Amanah —
                    </p>
                    <div className="inline-block text-6xl mb-3">{ending.icon}</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest mb-4 ${ending.badgeBg}`}>
                        {ending.badgeLabel}
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-black mb-2 ${ending.accentClass}`}>
                        {ending.title}
                    </h1>
                    <p className="text-gray-400 text-sm italic">{ending.subtitle}</p>
                </div>

                {/* ── STAT ACCUMULATION PANEL ── */}
                <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-6 mb-6 shadow-2xl">
                    <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2">
                        <span className="inline-block w-8 border-t border-yellow-600" />
                        Akumulasi Status Pilar Desa
                        <span className="inline-block flex-1 border-t border-yellow-600" />
                    </h2>
                    <AnimatedStatBar label="Kepercayaan Warga" value={stats.trust} color="bg-blue-500" delay={0} />
                    <AnimatedStatBar label="Kas Desa / Ekonomi" value={stats.treasury} color="bg-yellow-500" delay={150} />
                    <AnimatedStatBar label="Stabilitas Politik" value={stats.stability} color="bg-green-500" delay={300} />
                    <AnimatedStatBar label="Warisan Budaya" value={stats.legacy} color="bg-purple-500" delay={450} />
                </div>

                {/* ── ENDING CARD ── */}
                <div
                    className={`
            bg-linear-to-br ${ending.bgClass}
            border-2 ${ending.borderClass}
            rounded-2xl p-6 mb-6 shadow-2xl
          `}
                >
                    <p className="text-gray-200 leading-relaxed text-base mb-6">
                        {ending.description}
                    </p>

                    {ending.effects.length > 0 && (
                        <>
                            <hr className="border-slate-600 mb-4" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
                                Dampak Keputusan Akhir
                            </h3>
                            <ul className="space-y-2">
                                {ending.effects.map((e, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <span className={`mt-0.5 shrink-0 font-black text-base ${e.positive ? "text-green-400" : "text-red-400"}`}>
                                            {e.positive ? "▲" : "▼"}
                                        </span>
                                        <span>
                                            <span className="font-bold text-gray-300">{e.label}:</span>{" "}
                                            <span className="text-gray-400">{e.value}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* ── SCORE SUMMARY ── */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                    {[
                        { label: "Kepercayaan", value: stats.trust, color: "text-blue-400", icon: "👥" },
                        { label: "Kas Desa", value: stats.treasury, color: "text-yellow-400", icon: "💰" },
                        { label: "Stabilitas", value: stats.stability, color: "text-green-400", icon: "⚖️" },
                        { label: "Warisan", value: stats.legacy, color: "text-purple-400", icon: "🌿" },
                    ].map((s) => (
                        <div key={s.label} className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 text-center">
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── QUOTE / CLOSING ── */}
                <blockquote className="border-l-4 border-yellow-600 pl-4 mb-8 italic text-gray-400 text-sm leading-relaxed">
                    "Sejarah akan menulis apakah tanganmu membangun surga untuk wargamu,
                    atau malah membangun neraka yang indah."
                    <footer className="mt-1 text-gray-600 not-italic">— Mbah Darmo, Sesepuh Desa Amanah</footer>
                </blockquote>

                {/* ── BACK TO MENU ── */}
                <div className="text-center">
                    <button
                        onClick={onBackToMenu}
                        className="
              bg-linear-to-r from-yellow-700 to-amber-700
              hover:from-yellow-600 hover:to-amber-600
              text-white font-black text-lg
              px-10 py-4 rounded-xl
              border-b-4 border-yellow-900
              active:border-b-0 active:translate-y-1
              transition-all shadow-xl
              tracking-wide
            "
                    >
                        ✦ Kembali ke Menu Utama ✦
                    </button>
                    <p className="text-gray-600 text-xs mt-3">
                        Terima kasih telah bermain Suara yang Didengar
                    </p>
                </div>
            </div>
        </div>
    );
}
