"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { saveGame } from "../lib/game";
import EndingScreen from "./EndingScreen";
import { GameState, ChapterData } from "@/types/chapter-data";
import { CHAPTER_META_LIST } from "@/data";

type GameScreenProps = {
  storyData: ChapterData[];          // Semua scene dari chapter manapun
  startSceneId: string;              // Scene awal (bisa dari chapter berapa saja)
  onBackToMenu: () => void;          // Fungsi buat balik ke menu
  savedGameData?: { sceneId: string; stats: GameState } | null; // Data saved game (optional)
};

const DEFAULT_STATS: GameState = {
  trust: 50,
  treasury: 50,
  stability: 50,
  legacy: 50,
}

const DEBOUNCE_DELAY = 5000; // 5 seconds

export default function GameScreen({ storyData, startSceneId, onBackToMenu, savedGameData }: GameScreenProps) {
  // Gunakan saved game data jika ada, kalau tidak gunakan startSceneId
  const [currentSceneId, setCurrentSceneId] = useState<string>(
    savedGameData?.sceneId ?? startSceneId
  );

  // 1. STATS AKTUAL: Berubah di latar belakang tiap kali milih opsi (disimpan ke save data & ending)
  const [stats, setStats] = useState<GameState>(
    savedGameData?.stats ?? DEFAULT_STATS
  );

  // 2. STATS HUD (TAMPILAN): Dikunci pada nilai awal saat chapter dimulai
  // Kita tidak butuh fungsi setDisplayStats karena nilainya sengaja dibuat statis selama chapter berjalan
  const [displayStats] = useState<GameState>(
    savedGameData?.stats ?? DEFAULT_STATS
  );

  const [showEnding, setShowEnding] = useState(false);

  // Map untuk O(1) scene lookup
  const sceneMap = useMemo(
    () => new Map(storyData.map((s) => [s.id, s])),
    [storyData]
  );

  // Deteksi judul chapter aktif
  const activeChapterTitle = useMemo(() => {
    const meta = CHAPTER_META_LIST.find((m) => currentSceneId.startsWith(m.id));
    return meta ? `${meta.title}: ${meta.subtitle}` : "";
  }, [currentSceneId]);

  // States for Typing Animation
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Ref untuk debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);




  // Pindahkan character selalu di sebelah kanan layar
  const currentScene = sceneMap.get(currentSceneId)!;;
  const isPlayer = currentScene.characterName.includes("Anda") || currentScene.characterName.includes("Pak Kades");
  const characterPosClass = "right-5 md:right-[15%]";

  // Immediate autosave saat pindah chapter/scene
  useEffect(() => {
    // Skip save pada mount pertama kali
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Save langsung tanpa debounce ketika scene berubah
    saveGame(currentSceneId, stats);
  }, [currentSceneId]);

  // Autosave dengan debounce untuk perubahan stats
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer untuk autosave setelah 5 detik
    debounceTimerRef.current = setTimeout(() => {
      saveGame(currentSceneId, stats);
    }, DEBOUNCE_DELAY);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [stats]);

  // Typing Effect Logic
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    isTypingRef.current = true;
    let i = 0;
    const textToType = currentScene.text;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      // Saat skip, isTypingRef.current akan bernilai false
      if (!isTypingRef.current) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        return;
      }

      if (i < textToType.length) {
        setDisplayedText(textToType.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        isTypingRef.current = false;
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, 30); // Kecepatan ketikan dalam milidetik

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentSceneId, currentScene.text]);

  const handleSkipTyping = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isTypingRef.current) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      isTypingRef.current = false;
      setIsTyping(false);
      setDisplayedText(currentScene.text);
    }
  };

  const handleChoice = (e: React.MouseEvent, nextId: string, effect?: Partial<GameState>) => {
    e.stopPropagation();
    // Abaikan klik pilihan jika sedang ngetik (atau bisa auto-skip dulu)
    if (isTypingRef.current) {
      handleSkipTyping();
      return;
    }

    setCurrentSceneId(nextId);
    if (effect) {
      setStats((prev) => ({
        ...prev,
        trust: Math.min(100, Math.max(0, prev.trust + (effect.trust || 0))),
        treasury: Math.min(100, Math.max(0, prev.treasury + (effect.treasury || 0))),
        stability: Math.min(100, Math.max(0, prev.stability + (effect.stability || 0))),
        legacy: Math.min(100, Math.max(0, prev.legacy + (effect.legacy || 0))),
      }));
    }
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTypingRef.current) {
      handleSkipTyping();
      return;
    }

    const nextId = currentScene.nextSceneId;
    if (nextId) {
      setCurrentSceneId(nextId);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black text-white font-sans"
      onClick={handleSkipTyping}
    >

      {/* Ending Screen Overlay */}
      {showEnding && (
        <EndingScreen stats={stats} lastSceneId={currentSceneId} onBackToMenu={onBackToMenu} />
      )}

      {/* Tombol Back ke Menu (Pojok Kanan Atas) */}
      <button
        onClick={onBackToMenu}
        className="absolute top-5 right-5 z-50 bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 rounded border border-white/20 text-sm"
      >
        Keluar ke Menu
      </button>

      {/* --- LAYER 1: BACKGROUND --- */}
      {currentScene.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={currentScene.backgroundImage}
            alt="background"
            fill
            className="object-cover opacity-80"
            priority
            unoptimized
          />
        </div>
      )}

      {/* --- LAYER 2: STATS HUD --- */}
      <div className="absolute top-5 left-5 z-20 bg-slate-800/90 backdrop-blur-sm border-2 border-yellow-600 p-4 rounded-lg shadow-lg w-64">
        {activeChapterTitle && (
          <p className="text-yellow-400 text-[10px] uppercase tracking-widest mb-2 truncate font-semibold">
            {activeChapterTitle}
          </p>
        )}

        <h3 className="text-yellow-500 font-bold mb-2 uppercase tracking-wider text-sm">
          Status Desa
        </h3>

        <StatBar label="Kepercayaan" value={displayStats.trust} color="bg-blue-500" />
        <StatBar label="Kas Desa" value={displayStats.treasury} color="bg-yellow-500" />
        <StatBar label="Stabilitas" value={displayStats.stability} color="bg-green-500" />
        <StatBar label="Warisan" value={displayStats.legacy} color="bg-purple-400" />
      </div>

      {/* --- LAYER 3: CHARACTER --- */}
      {currentScene.characterImage && (
        <div className={`absolute bottom-[200px] ${characterPosClass} z-10 w-[350px] h-[600px] md:w-[450px] md:h-[800px] transition-all duration-500 pointer-events-none`}>
          <Image
            src={currentScene.characterImage}
            alt="character"
            fill
            className={`object-contain object-bottom drop-shadow-2xl ${isPlayer ? 'scale-x-[-1]' : ''}`}
            unoptimized
          />
        </div>
      )}

      {/* --- LAYER 4: DIALOGUE & CHOICES CONTAINER --- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-5xl flex flex-col gap-2 pointer-events-none">

        {/* TEXT DIALOG BOX - Hidden when choices are shown */}
        {!((!isTyping && currentScene.choices && currentScene.choices.length > 0)) && (
          <div
            className="relative w-full min-h-[220px] max-h-[50vh] cursor-pointer pointer-events-auto shrink-0 flex flex-col"
            onClick={handleSkipTyping}
          >
            {/* Latar Belakang Kotak Dialog */}
            <div className="absolute inset-0 z-0 drop-shadow-2xl">
              <Image
                src={"/ui/txt box 1.png"}
                alt="dialog box"
                fill
                className="object-fill rounded-xl opacity-95"
                unoptimized
              />
            </div>

            {/* Frame / Border */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <Image
                src={'/ui/dialog border.png'}
                alt="dialog border"
                fill
                className="object-fill"
                unoptimized
              />
            </div>

            {/* Konten Text */}
            <div className="relative z-20 h-full p-8 flex flex-col pt-12 flex-1">
              {/* Tag Nama */}
              <div className="absolute -top-3 left-8 z-30 drop-shadow-xl">
                <div className="relative inline-block px-10 py-3">
                  <div className="absolute inset-0 bg-[#3b2a1a] border-2 border-[#b08d6a] rounded-t-xl rounded-br-xl opacity-90 skew-x-[-10deg]"></div>
                  <span className="relative z-10 text-[#fcedd9] font-bold text-lg md:text-xl font-serif drop-shadow-md tracking-wider">
                    {currentScene.characterName}
                  </span>
                </div>
              </div>

              <div className="overflow-y-auto pr-4 mb-2 mt-4 shrink flex-col flex flex-1">
                <p className="text-[#3b2a1a] text-lg md:text-2xl leading-relaxed font-serif font-bold drop-shadow-sm min-h-[80px]">
                  {displayedText}
                  {isTyping && <span className="inline-block w-2 bg-[#3b2a1a] ml-1 animate-pulse h-[1.2em] align-middle"></span>}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CHOICES - Tampil setelah dialog selesai dengan layout grid 2 kolom */}
        {!isTyping && currentScene.choices && currentScene.choices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-auto w-full">
            {currentScene.choices.map((choice, index) => (
              <button
                key={index}
                onClick={(e) => handleChoice(e, choice.nextId, choice.effect)}
                className="group relative w-full min-h-[200px] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              >
                {/* Background box */}
                <div className="absolute inset-0 z-0 drop-shadow-2xl">
                  <Image
                    src={"/ui/txt box 1.png"}
                    alt="choice box"
                    fill
                    className="object-fill opacity-95 group-hover:opacity-100"
                    unoptimized
                  />
                </div>

                {/* Border frame */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <Image
                    src={'/ui/dialog border.png'}
                    alt="choice border"
                    fill
                    className="object-fill"
                    unoptimized
                  />
                </div>

                {/* Text content */}
                <div className="relative z-20 px-8 py-8 flex items-center justify-center h-full">
                  <p className="text-[#3b2a1a] text-base md:text-lg font-serif font-bold drop-shadow-sm text-center transition-transform group-hover:scale-105 leading-relaxed">
                    {choice.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* CONTINUE BUTTON - Untuk scene dengan nextSceneId tanpa choices */}
        {!isTyping && currentScene.nextSceneId && currentScene.nextSceneId !== "" &&
          (!currentScene.choices || currentScene.choices.length === 0) && (
            <button
              onClick={handleContinue}
              className="group relative w-full min-h-[70px] pointer-events-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Background box */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={"/ui/txt box 1.png"}
                  alt="continue box"
                  fill
                  className="object-fill rounded-lg opacity-90 group-hover:opacity-100"
                  unoptimized
                />
              </div>

              {/* Border frame */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                  src={'/ui/dialog border.png'}
                  alt="continue border"
                  fill
                  className="object-fill"
                  unoptimized
                />
              </div>

              {/* Text content */}
              <div className="relative z-20 px-6 py-4 flex items-center justify-center gap-2">
                <p className="text-[#3b2a1a] text-lg md:text-2xl font-serif font-bold drop-shadow-sm transition-transform group-hover:scale-105">
                  Lanjutkan
                </p>
                <span className="text-[#3b2a1a] text-2xl animate-pulse">▶</span>
              </div>
            </button>
          )}

        {/* BACK TO MENU - Untuk scene ending (no nextSceneId, no choices) */}
        {!isTyping && (!currentScene.nextSceneId || currentScene.nextSceneId === "") &&
          (!currentScene.choices || currentScene.choices.length === 0) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEnding(true);
              }}
              className="group relative w-full min-h-[70px] pointer-events-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Background box */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={"/ui/txt box 1.png"}
                  alt="ending box"
                  fill
                  className="object-fill rounded-lg opacity-90 group-hover:opacity-100"
                  unoptimized
                />
              </div>

              {/* Border frame */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                  src={'/ui/dialog border.png'}
                  alt="ending border"
                  fill
                  className="object-fill"
                  unoptimized
                />
              </div>

              {/* Text content */}
              <div className="relative z-20 px-6 py-4 flex items-center justify-center">
                <p className="text-[#3b2a1a] text-lg md:text-2xl font-serif font-bold drop-shadow-sm transition-transform group-hover:scale-105">
                  Lihat Hasil Akhir
                </p>
              </div>
            </button>
          )}
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between text-xs mb-1 font-bold text-gray-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-600">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out shadow-[0_0_10px_currentColor]`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}