"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { saveGame, markChapterPlayed } from "../lib/game";
import EndingScreen from "./EndingScreen";
import AudioControls from "./AudioControls";
import { GameState, ChapterData } from "@/types/chapter-data";
import { CHAPTER_META_LIST } from "@/data";
import AudioManager from "@/lib/audioManager";

type GameScreenProps = {
  storyData: ChapterData[]; // Semua scene dari chapter manapun
  startSceneId: string; // Scene awal (bisa dari chapter berapa saja)
  onBackToMenu: () => void; // Fungsi buat balik ke menu
  savedGameData?: { sceneId: string; stats: GameState } | null; // Data saved game (optional)
};

const DEFAULT_STATS: GameState = {
  trust: 50,
  treasury: 50,
  stability: 50,
  legacy: 50,
};

const DEBOUNCE_DELAY = 5000; // 5 seconds

export default function GameScreen({
  storyData,
  startSceneId,
  onBackToMenu,
  savedGameData,
}: GameScreenProps) {
  // Gunakan saved game data jika ada, kalau tidak gunakan startSceneId
  const [currentSceneId, setCurrentSceneId] = useState<string>(
    savedGameData?.sceneId ?? startSceneId,
  );

  // 1. STATS AKTUAL: Berubah di latar belakang tiap kali milih opsi (disimpan ke save data & ending)
  const [stats, setStats] = useState<GameState>(
    savedGameData?.stats ?? DEFAULT_STATS,
  );

  // 2. STATS HUD (TAMPILAN): Dikunci pada nilai awal saat chapter dimulai
  // Kita tidak butuh fungsi setDisplayStats karena nilainya sengaja dibuat statis selama chapter berjalan
  const [displayStats] = useState<GameState>(
    savedGameData?.stats ?? DEFAULT_STATS,
  );

  const [showEnding, setShowEnding] = useState(false);

  // Map untuk O(1) scene lookup
  const sceneMap = useMemo(
    () => new Map(storyData.map((s) => [s.id, s])),
    [storyData],
  );

  // Deteksi judul chapter aktif
  const activeChapterTitle = useMemo(() => {
    const meta = CHAPTER_META_LIST.find((m) => currentSceneId.startsWith(m.id));
    return meta ? `${meta.title}: ${meta.subtitle}` : "";
  }, [currentSceneId]);

  // States for Typing Animation
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Ref untuk debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Pindahkan character selalu di sebelah kanan layar
  const currentScene = sceneMap.get(currentSceneId)!;
  const isPlayer =
    currentScene.characterName.includes("Anda") ||
    currentScene.characterName.includes("Pak Kades");
  const characterPosClass = "right-5 md:right-[15%]";

  // --- TAMBAHAN BARU: STATE FULLSCREEN & DETEKSI MOBILE ---
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Deteksi apakah perangkat adalah mobile (bukan Desktop Site)
    const checkMobile = () => {
      const userAgent =
        typeof window !== "undefined" ? navigator.userAgent : "";
      setIsMobileDevice(/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent));
    };
    checkMobile();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Fungsi Toggle Fullscreen (Landscape Lock dihilangkan)
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Gagal masuk fullscreen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen().catch(console.error);
      }
    }
  };

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
    setShowSkipButton(false); // Reset skip button saat mulai typing
    let i = 0;
    const textToType = currentScene.text;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    // Timer untuk menampilkan skip button setelah 3 detik
    const skipButtonTimer = setTimeout(() => {
      if (isTypingRef.current) {
        setShowSkipButton(true);
      }
    }, 3000); // 3 detik

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
        setShowSkipButton(false); // Sembunyikan skip button saat typing selesai
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, 32 ); // Kecepatan ketikan dalam milidetik

    return () => {
      clearTimeout(skipButtonTimer);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentSceneId, currentScene.text]);

  // Audio Playback Logic
  useEffect(() => {
    const audioManager = AudioManager.getInstance();
    
    // Play background music jika scene punya field backgroundMusic
    if (currentScene.backgroundMusic) {
      audioManager.playBackgroundMusic(currentScene.backgroundMusic);
    }
    
    // Play narrator jika scene punya field narratorAudio
    if (currentScene.narratorAudio) {
      audioManager.playNarrator(currentScene.narratorAudio);
    } else {
      // Stop narrator jika scene tidak punya narrator
      audioManager.stopNarrator();
    }
    
    // Cleanup saat unmount (balik ke menu)
    return () => {
      if (showEnding) {
        // Jika sudah ending, cleanup semua audio
        audioManager.cleanup();
      }
    };
  }, [currentSceneId, currentScene, showEnding]);

  const handleSkipTyping = () => {
    if (isTypingRef.current) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      isTypingRef.current = false;
      setIsTyping(false);
      setShowSkipButton(false); // Sembunyikan skip button saat di-skip
      setDisplayedText(currentScene.text);
    }
  };

  const handleChoice = (
    e: React.MouseEvent,
    nextId: string,
    effect?: Partial<GameState>,
  ) => {
    e.stopPropagation();
    // User harus tunggu typing selesai sebelum bisa klik choice
    if (isTypingRef.current) {
      return;
    }

    setCurrentSceneId(nextId);
    if (effect) {
      setStats((prev) => ({
        ...prev,
        trust: Math.min(100, Math.max(0, prev.trust + (effect.trust || 0))),
        treasury: Math.min(
          100,
          Math.max(0, prev.treasury + (effect.treasury || 0)),
        ),
        stability: Math.min(
          100,
          Math.max(0, prev.stability + (effect.stability || 0)),
        ),
        legacy: Math.min(100, Math.max(0, prev.legacy + (effect.legacy || 0))),
      }));
    }
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    // User harus tunggu typing selesai sebelum bisa klik continue
    if (isTypingRef.current) {
      return;
    }

    const nextId = currentScene.nextSceneId;
    if (nextId) {
      setCurrentSceneId(nextId);
    }
  };

  // Helper: Apakah sekarang waktunya menampilkan pilihan?
  const showChoices =
    !isTyping && currentScene.choices && currentScene.choices.length > 0;

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black text-white font-sans"
    >
      {/* Ending Screen Overlay */}
      {showEnding && (
        <EndingScreen
          stats={stats}
          lastSceneId={currentSceneId}
          onBackToMenu={onBackToMenu}
        />
      )}

      {/* Tombol Aksi (Pojok Kanan Atas) - Sesuai Tema */}
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-50 flex gap-3 pointer-events-auto">
        {/* Tombol Fullscreen */}
        {!isMobileDevice && (
          <button
            onClick={toggleFullscreen}
            className="group relative h-[35px] md:h-[45px] px-4 md:px-6 flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
          >
            <div className="absolute inset-0 z-0 drop-shadow-lg">
              <Image
                src={"/ui/txt box 1.png"}
                alt="bg btn"
                fill
                className="object-fill rounded opacity-90 group-hover:opacity-100"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
              <Image
                src={"/ui/dialog border.png"}
                alt="border btn"
                fill
                className="object-fill"
                unoptimized
              />
            </div>
            <span className="relative z-20 text-[#3b2a1a] font-serif font-bold text-xs md:text-sm drop-shadow-sm tracking-wider uppercase">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </button>
        )}

        {/* Tombol Keluar ke Menu */}
        <button
          onClick={onBackToMenu}
          className="group relative h-[35px] md:h-[45px] px-4 md:px-6 flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
        >
          <div className="absolute inset-0 z-0 drop-shadow-lg">
            <Image
              src={"/ui/txt box 1.png"}
              alt="bg btn"
              fill
              className="object-fill rounded opacity-90 group-hover:opacity-100"
              unoptimized
            />
          </div>
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image
              src={"/ui/dialog border.png"}
              alt="border btn"
              fill
              className="object-fill"
              unoptimized
            />
          </div>
          <span className="relative z-20 text-[#3b2a1a] font-serif font-bold text-xs md:text-sm drop-shadow-sm tracking-wider uppercase">
            Menu Utama
          </span>
        </button>
      </div>

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
      {/* Di HP: jarak top/left 4, width 48 (192px), padding 3. Di Desktop balik normal */}
      <div className="absolute top-4 left-4 md:top-5 md:left-5 z-20 bg-slate-800/90 backdrop-blur-sm border-2 border-yellow-600 p-3 md:p-4 rounded-lg shadow-lg w-48 md:w-64">
        {activeChapterTitle && (
          <p className="text-yellow-400 text-[8px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2 truncate font-semibold">
            {activeChapterTitle}
          </p>
        )}

        <h3 className="text-yellow-500 font-bold mb-1 md:mb-2 uppercase tracking-wider text-xs md:text-sm">
          Status Desa
        </h3>

        <div className="flex flex-col gap-1 md:gap-0">
          <StatBar
            label="Kepercayaan"
            value={displayStats.trust}
            color="bg-blue-500"
          />
          <StatBar
            label="Kas Desa"
            value={displayStats.treasury}
            color="bg-yellow-500"
          />
          <StatBar
            label="Stabilitas"
            value={displayStats.stability}
            color="bg-green-500"
          />
          <StatBar
            label="Warisan"
            value={displayStats.legacy}
            color="bg-purple-400"
          />
        </div>
      </div>

      {/* --- LAYER 3: CHARACTER --- */}
      {/* Karakter akan HILANG otomatis kalau showChoices sedang true */}
      {currentScene.characterImage && !showChoices && (
        <div
          className={`absolute bottom-50 ${characterPosClass} z-10 w-87.5 h-150 md:w-112.5 md:h-200 transition-all duration-500 pointer-events-none`}
        >
          <Image
            src={currentScene.characterImage}
            alt="character"
            fill
            className={`object-contain object-bottom drop-shadow-2xl ${isPlayer ? "scale-x-[-1]" : ""}`}
            unoptimized
          />
        </div>
      )}

      {/* --- LAYER 4: DIALOGUE & CHOICES CONTAINER --- */}
      {/* max-h-[65vh] di mobile biar gak nabrak status desa, flex-col justify-end biar nekan ke bawah */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-5xl flex flex-col justify-end gap-2 md:gap-4 pointer-events-none max-h-[65vh] md:max-h-[95vh]">
        {/* TEXT DIALOG BOX */}
        {!showChoices && (
          <div
            className="relative w-full min-h-55 max-h-[50vh] pointer-events-auto shrink-0 flex flex-col"
          >
            <div className="absolute inset-0 z-0 drop-shadow-2xl">
              <Image
                src={"/ui/txt box 1.png"}
                alt="dialog box"
                fill
                className="object-fill rounded-xl opacity-95"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
              <Image
                src={"/ui/dialog border.png"}
                alt="dialog border"
                fill
                className="object-fill"
                unoptimized
              />
            </div>

            <div className="relative z-20 h-full p-4 md:p-8 flex flex-col pt-10 md:pt-12">
              <div className="absolute -top-3 left-4 md:left-8 z-30 drop-shadow-xl scale-[0.85] md:scale-100 origin-left">
                <div className="relative inline-block px-8 py-2 md:py-3">
                  <div className="absolute inset-0 bg-[#3b2a1a] border-2 border-[#b08d6a] rounded-t-xl rounded-br-xl opacity-90 skew-x-[-10deg]"></div>
                  <span className="relative z-10 text-[#fcedd9] font-bold text-sm md:text-xl font-serif drop-shadow-md tracking-wider">
                    {currentScene.characterName}
                  </span>
                </div>
              </div>

              {/* min-h-0 ini KUNCI biar overflow-y-auto jalan sempurna di flexbox */}
              <div className="overflow-y-auto pl-4 pr-8 md:pl-10 md:pr-14 py-2 flex-1 min-h-0 pointer-events-auto">
                <p className="text-[#3b2a1a] text-base md:text-2xl leading-relaxed font-serif font-bold drop-shadow-sm pb-6">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-[6px] md:w-2 bg-[#3b2a1a] ml-1 animate-pulse h-[1.2em] align-middle"></span>
                  )}
                </p>
              </div>

              {/* Skip Button - muncul setelah 3 detik */}
              {showSkipButton && isTyping && (
                <button
                  onClick={handleSkipTyping}
                  className="absolute bottom-4 right-6 bg-amber-600/90 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg border-2 border-amber-800/50 text-sm font-bold transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 z-40 animate-fade-in backdrop-blur-sm"
                  style={{
                    animation: 'fadeIn 0.3s ease-in-out',
                  }}
                >
                  Skip ⏭
                </button>
              )}
            </div>
          </div>
        )}

        {/* CHOICES CONTAINER */}
        {showChoices && (
          <div className="flex flex-col items-center w-full pointer-events-auto overflow-y-auto max-h-full pb-2">
            <div className="mb-6 md:mb-10 w-full flex flex-col items-center animate-[pulse_3s_ease-in-out_infinite] shrink-0">
              <div className="relative px-4 py-3 md:py-6 bg-linear-to-r from-transparent via-[#895129] to-transparent w-full flex flex-col items-center justify-center backdrop-blur-[2px]">
                <div className="absolute top-0 w-3/4 md:w-1/2 h-0.5 bg-linear-to-r from-transparent via-[#d4bc96] to-transparent"></div>
                <p
                  className="text-white text-sm md:text-2xl font-black font-serif tracking-[0.2em] md:tracking-[0.3em] text-center uppercase relative z-10"
                  style={{
                    textShadow:
                      "0px 4px 15px rgba(0,0,0,1), 2px 2px 0px rgba(140, 94, 53, 0.8), -1px -1px 0px rgba(0,0,0,0.8)",
                  }}
                >
                  ✧ Keputusan Ada Di Tanganmu ✧
                </p>
                <div className="absolute bottom-0 w-3/4 md:w-1/2 h-0.5 bg-linear-to-r from-transparent via-[#d4bc96] to-transparent"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
              {currentScene.choices!.map((choice, index) => (
                <button
                  key={index}
                  onClick={(e) => handleChoice(e, choice.nextId, choice.effect)}
                  className="group relative w-full min-h-[60px] md:min-h-[80px] shrink-0 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                >
                  <div className="absolute inset-0 z-0 drop-shadow-2xl">
                    <Image
                      src={"/ui/txt box 1.png"}
                      alt="choice box"
                      fill
                      className="object-fill opacity-95 group-hover:opacity-100"
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <Image
                      src={"/ui/dialog border.png"}
                      alt="choice border"
                      fill
                      className="object-fill"
                      unoptimized
                    />
                  </div>
                  <div className="relative z-20 px-6 py-4 flex items-center justify-center h-full">
                    <p className="text-[#3b2a1a] text-sm md:text-lg font-serif font-bold drop-shadow-sm text-center transition-transform group-hover:scale-105 leading-relaxed">
                      {choice.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONTINUE BUTTON */}
        {!isTyping &&
          currentScene.nextSceneId &&
          currentScene.nextSceneId !== "" &&
          (!currentScene.choices || currentScene.choices.length === 0) && (
            <button
              onClick={handleContinue}
              // Ganti min-h-17.5 jadi h-[55px] dan pastikan ada shrink-0
              className="group relative w-full h-[55px] md:h-[70px] shrink-0 pointer-events-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={"/ui/txt box 1.png"}
                  alt="continue box"
                  fill
                  className="object-fill rounded-lg opacity-90 group-hover:opacity-100"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                  src={"/ui/dialog border.png"}
                  alt="continue border"
                  fill
                  className="object-fill"
                  unoptimized
                />
              </div>
              <div className="relative z-20 px-6 py-2 flex items-center justify-center gap-2 h-full">
                <p className="text-[#3b2a1a] text-lg md:text-2xl font-serif font-bold drop-shadow-sm transition-transform group-hover:scale-105">
                  Lanjutkan
                </p>
                <span className="text-[#3b2a1a] text-xl md:text-2xl animate-pulse">
                  ▶
                </span>
              </div>
            </button>
          )}

        {/* BACK TO MENU (ENDING) BUTTON */}
        {!isTyping &&
          (!currentScene.nextSceneId || currentScene.nextSceneId === "") &&
          (!currentScene.choices || currentScene.choices.length === 0) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markChapterPlayed(startSceneId.split("_")[0], stats);
                setShowEnding(true);
              }}
              // Ganti min-h-17.5 jadi h-[55px] dan pastikan ada shrink-0
              className="group relative w-full h-[55px] md:h-[70px] shrink-0 pointer-events-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={"/ui/txt box 1.png"}
                  alt="ending box"
                  fill
                  className="object-fill rounded-lg opacity-90 group-hover:opacity-100"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                  src={"/ui/dialog border.png"}
                  alt="ending border"
                  fill
                  className="object-fill"
                  unoptimized
                />
              </div>
              <div className="relative z-20 px-6 py-2 flex items-center justify-center h-full">
                <p className="text-[#3b2a1a] text-lg md:text-2xl font-serif font-bold drop-shadow-sm transition-transform group-hover:scale-105">
                  Lihat Hasil Akhir
                </p>
              </div>
            </button>
          )}
      </div>

      {/* Audio Controls */}
      <AudioControls visible={true} />
    </div>
  );
}

function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
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
