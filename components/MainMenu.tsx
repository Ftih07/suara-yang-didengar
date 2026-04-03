"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { hasSavedGame, loadGame, getPlayedChapters } from "../lib/game";
import { GameState } from "@/types/chapter-data";
import AudioManager from "@/lib/audioManager";
import AudioControls from "@/components/AudioControls";
type MainMenuProps = {
  onSelectChapter: (startId: string) => void;
  onContinueGame: () => void;
};

// --- Komponen Bantuan untuk Bar Status di Modal ---
const SimpleStatBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
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
          className={`text-lg font-black tabular-nums ${qualityColor} font-serif`}
        >
          {value}%
        </span>
      </div>
      <div className="w-full bg-[#d4bc96]/50 border border-[#b08d6a] h-3 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full shadow-inner transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Fungsi pembaca status untuk memberikan tips/catatan Kades
const getStatusFeedback = (stats: GameState) => {
  const { trust, treasury, stability, legacy } = stats;

  if (trust <= 35 && treasury <= 35 && stability <= 35) {
    return "Kondisi kritis! Desa berada di ambang kehancuran. Setiap keputusan Anda selanjutnya akan menjadi penentu hidup matinya Amanah.";
  }
  if (trust >= 75 && treasury >= 75 && stability >= 75) {
    return "Masa keemasan Desa Amanah! Warga makmur, kas penuh, dan desa sangat damai. Kepemimpinan yang luar biasa!";
  }
  if (treasury >= 70 && trust <= 40) {
    return "Kas desa memang melimpah, tapi rasa percaya warga memudar. Hati-hati, uang yang banyak tidak akan bisa membendung kemarahan rakyat yang kecewa.";
  }
  if (trust >= 70 && treasury <= 40) {
    return "Warga sangat mencintai dan mengandalkan Anda, namun kas yang menipis berisiko membuat janji-janji Anda gagal terealisasi. Perlu strategi keuangan yang cerdas.";
  }
  if (stability <= 35) {
    return "Ketegangan di masyarakat sedang tinggi. Stabilitas yang goyah sangat rentan memicu konflik horizontal. Utamakan keputusan yang mendamaikan.";
  }
  if (legacy <= 35) {
    return "Kemajuan desa mulai mengorbankan warisan leluhur dan ekologi kita. Ingatlah bahwa identitas desa sama pentingnya dengan materi.";
  }

  return "Kondisi desa terpantau seimbang dan terkendali. Teruskan kepemimpinan Anda dengan penuh pertimbangan dan kebijaksanaan.";
};

export default function MainMenu({
  onSelectChapter,
  onContinueGame,
}: MainMenuProps) {
  const [hasSave, setHasSave] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [savedStats, setSavedStats] = useState<GameState | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [menuView, setMenuView] = useState<'main' | 'chapterSelect'>('main');
  const [playedChapters, setPlayedChapters] = useState<string[]>([]);
  const [showAudioControls, setShowAudioControls] = useState(false);

  useEffect(() => {
    setHasSave(hasSavedGame());
    setPlayedChapters(getPlayedChapters());

    // Aggressive autoplay attempt with fallback
    const audioManager = AudioManager.getInstance();
    
    // Try immediate autoplay
    audioManager.playBackgroundMusic('menu');
    
    // Fallback: if autoplay was blocked, try on first user interaction
    const handleFirstInteraction = () => {
      if (!audioManager.isBgMusicPlaying()) {
        audioManager.playBackgroundMusic('menu');
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      // Don't stop music here, let GameScreen handle the transition
    };
  }, []);

  const handleStartFresh = () => {
    if (selectedChapterId) {
      onSelectChapter(selectedChapterId);
      setShowModal(false);
      setSelectedChapterId(null);
    }
  };

  const handleContinueSaved = () => {
    onContinueGame();
    setShowModal(false);
    setSelectedChapterId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChapterId(null);
  };

  // Fungsi untuk menampilkan Status Desa
  const handleShowStatus = () => {
    const savedData = loadGame();
    if (savedData && savedData.stats) {
      setSavedStats(savedData.stats);
    } else {
      setSavedStats(null);
    }
    setShowStatusModal(true);
  };

  const chapters = [
    { id: 1, title: "Chapter 1", startId: "ch1_intro", locked: false }, // selalu terbuka, starting point
    { id: 2, title: "Chapter 2", startId: "ch2_intro", locked: !playedChapters.includes("ch1") },
    { id: 3, title: "Chapter 3", startId: "ch3_intro", locked: !playedChapters.includes("ch2") },
    { id: 4, title: "Chapter 4", startId: "ch4_intro", locked: !playedChapters.includes("ch3") },
    { id: 5, title: "Chapter 5", startId: "ch5_intro", locked: !playedChapters.includes("ch4") },
    { id: 6, title: "Chapter 6", startId: "ch6_intro", locked: true },
    { id: 7, title: "Chapter 7", startId: "ch7_intro", locked: true },
    { id: 8, title: "Chapter 8", startId: "ch8_intro", locked: true },
    { id: 9, title: "Chapter 9", startId: "ch9_intro", locked: true },
    { id: 10, title: "Chapter 10", startId: "ch10_intro", locked: true },
  ];

  const handleChapterClick = (chapter: {
    locked: boolean;
    startId: string;
  }) => {
    if (chapter.locked) return;
    if (hasSave) {
      setSelectedChapterId(chapter.startId);
      setShowModal(true);
    } else {
      onSelectChapter(chapter.startId);
    }
  };

  const WoodButton = ({
    children,
    onClick,
    width = "w-[340px]",
    className = "",
  }: any) => (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center h-19 ${width} group transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <Image
        src="/ui/txt box 1.png"
        alt="btn bg"
        fill
        className="object-fill drop-shadow-xl pointer-events-none"
        unoptimized
      />
      <span
        className="relative z-10 text-[26px] font-bold tracking-widest uppercase mt-1"
        style={{
          color: "#5e3a21",
          textShadow:
            "1px 1px 0px #ebcca5, -1px -1px 0px #ebcca5, 1px -1px 0px #ebcca5, -1px 1px 0px #ebcca5",
          fontFamily: "Georgia, serif",
        }}
      >
        {children}
      </span>
    </button>
  );

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center font-serif overflow-hidden select-none">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/bg-blur-desa.webp"
          alt="bg"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Slightly darken to make UI stand out */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Audio Controls Toggle Button */}
      <button
        onClick={() => setShowAudioControls(!showAudioControls)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#5e3a21] border-3 border-[#8B4513] rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
        title={showAudioControls ? "Sembunyikan Audio Controls" : "Tampilkan Audio Controls"}
        style={{
          boxShadow: "0 6px 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.3)",
        }}
      >
        <span className="text-3xl">{showAudioControls ? "✖️" : "🔊"}</span>
      </button>

      {/* Audio Controls */}
      <AudioControls visible={showAudioControls} onClose={() => setShowAudioControls(false)} />

      {menuView === "main" && (
        <div className="relative z-10 flex flex-col items-center w-full h-full pt-16">
          {/* Top Left Character Icon */}
          <div className="absolute top-6 left-6 w-20 h-20 bg-[#3d271d] border-4 border-[#24150e] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            <Image
              src="/characters/kades-normal.png"
              alt="Profile"
              width={80}
              height={80}
              className="object-cover scale-150 mt-10"
              unoptimized
            />
          </div>

          {/* Title */}
          <div className="mb-14">
            <h1
              className="text-6xl md:text-[80px] font-black tracking-widest text-[#5e3a21] text-center px-4"
              style={{
                fontFamily: "Georgia, serif",
                WebkitTextStroke: "3px #ebcca5",
                textShadow: "6px 6px 12px rgba(0,0,0,0.6)",
              }}
            >
              SUARA YANG DIDENGAR
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-6 items-center">
            {hasSave && (
              <WoodButton onClick={handleContinueSaved}>LANJUTKAN</WoodButton>
            )}
            <WoodButton onClick={() => setMenuView("chapterSelect")}>
              MAIN CHAPTER
            </WoodButton>

            {/* Tombol Status Desa sekarang punya fungsi */}
            <WoodButton onClick={handleShowStatus}>STATUS DESA</WoodButton>

            <WoodButton onClick={() => { }}>PENGATURAN</WoodButton>
            <WoodButton onClick={() => { }}>KREDIT</WoodButton>
          </div>
        </div>
      )}

      {menuView === "chapterSelect" && (
        <div className="relative z-10 flex flex-col items-center w-full h-full pt-12">
          {/* Back Button */}
          <button
            onClick={() => setMenuView("main")}
            className="absolute top-8 left-8 text-[#ebcca5] hover:text-white font-bold text-2xl drop-shadow-md transition-transform hover:scale-110"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            ◀ KEMBALI
          </button>

          {/* Title */}
          <h2
            className="text-6xl font-black mb-16 tracking-wider"
            style={{
              color: "#5e3a21",
              WebkitTextStroke: "2px #ebcca5",
              textShadow: "4px 4px 8px rgba(0,0,0,0.7)",
              fontFamily: "Georgia, serif",
            }}
          >
            Mainkan Chapter
          </h2>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-200 px-6">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter)}
                disabled={chapter.locked}
                className={`relative flex items-center h-19 w-full transition-all duration-300 ${chapter.locked
                  ? "opacity-60 cursor-not-allowed contrast-75"
                  : "hover:scale-105 active:scale-95 cursor-pointer"
                  }`}
              >
                <Image
                  src="/ui/txt box 1.png"
                  alt="btn bg"
                  fill
                  className="object-fill drop-shadow-xl pointer-events-none"
                  unoptimized
                />

                {/* Icon inside button (book or lock) */}
                <div className="relative z-10 ml-6 flex items-center justify-center w-10">
                  {chapter.locked ? (
                    <Image
                      src="/ui/lock 1.png"
                      alt="lock"
                      width={32}
                      height={32}
                      unoptimized
                    />
                  ) : (
                    <Image
                      src="/ui/book 9.png"
                      alt="book"
                      width={42}
                      height={42}
                      unoptimized
                    />
                  )}
                </div>

                {/* Chapter Title */}
                <span
                  className="relative z-10 text-[26px] font-bold ml-6 mt-1"
                  style={{
                    color: "#5e3a21",
                    textShadow:
                      "1px 1px 0px #ebcca5, -1px -1px 0px #ebcca5, 1px -1px 0px #ebcca5, -1px 1px 0px #ebcca5",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {chapter.title}
                </span>
                {playedChapters.includes(chapter.startId.split("_")[0]) && (
                  <span
                    className="absolute right-6 z-20 text-[28px]"
                    title="Sudah dimainkan"
                    style={{ filter: "drop-shadow(0px 0px 6px rgba(34, 197, 94, 0.8))" }}
                  >
                    ✅
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL KONFIRMASI (NEW GAME) ── */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-100 bg-[#3a2517] rounded-xl border-4 border-[#8B4513] shadow-2xl p-6 flex flex-col items-center">
            <div className="absolute inset-0 bg-[url('/backgrounds/kantor-desa.png')] bg-cover opacity-10 rounded-lg pointer-events-none" />
            <h2 className="relative z-10 text-2xl font-bold text-[#ebcca5] mb-4 text-center">
              Perhatian!
            </h2>
            <p className="relative z-10 text-[#ebcca5] text-center mb-8">
              Memulai permainan baru akan <b>menimpa</b> progres Anda
              sebelumnya. Apakah Anda yakin?
            </p>
            <div className="relative z-10 flex flex-col gap-4 w-full">
              <WoodButton width="w-full" onClick={handleStartFresh}>
                MULAI BARU
              </WoodButton>
              <WoodButton width="w-full" onClick={handleContinueSaved}>
                LANJUTKAN SAVE
              </WoodButton>
              <WoodButton width="w-full" onClick={handleCloseModal}>
                BATAL
              </WoodButton>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL STATUS DESA ── */}
      {showStatusModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="relative w-full max-w-md bg-[#e8d5b5] rounded-xl border-4 border-[#8c5e35] shadow-2xl p-6 md:p-8">
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] rounded-lg pointer-events-none" />

            <h2 className="relative z-10 text-2xl md:text-3xl font-black text-[#3b2a1a] mb-6 text-center font-serif drop-shadow-sm border-b-2 border-[#b08d6a] pb-4">
              Status Desa Saat Ini
            </h2>

            <div className="relative z-10">
              {savedStats ? (
                <div className="space-y-1">
                  <SimpleStatBar
                    label="Kepercayaan"
                    value={savedStats.trust}
                    color="bg-blue-600"
                  />
                  <SimpleStatBar
                    label="Kas Desa"
                    value={savedStats.treasury}
                    color="bg-yellow-500"
                  />
                  <SimpleStatBar
                    label="Stabilitas"
                    value={savedStats.stability}
                    color="bg-green-600"
                  />
                  <SimpleStatBar
                    label="Warisan"
                    value={savedStats.legacy}
                    color="bg-purple-600"
                  />

                  {/* --- TAMBAHAN KOTAK CATATAN DISINI --- */}
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-[#b08d6a]">
                    <div className="bg-[#d4bc96]/40 rounded-lg p-4 shadow-sm">
                      <p className="text-center text-[#5a4027] font-serif italic text-sm leading-relaxed">
                        <span className="block font-bold text-[#8c5e35] not-italic mb-1 text-xs uppercase tracking-widest">
                          📜 Catatan Penasihat
                        </span>
                        "{getStatusFeedback(savedStats)}"
                      </p>
                    </div>
                  </div>
                  {/* ----------------------------------- */}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[#5a4027] font-serif italic text-lg">
                    Belum ada data permainan yang tersimpan.
                  </p>
                  <p className="text-[#8c5e35] font-serif text-sm mt-2">
                    Mulai petualanganmu sebagai Kepala Desa!
                  </p>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-8 flex justify-center">
              <button
                onClick={() => setShowStatusModal(false)}
                className="
                  bg-linear-to-b from-[#8c5e35] to-[#5a4027]
                  hover:from-[#7a502a] hover:to-[#4a331e]
                  text-[#fcedd9] font-black text-lg font-serif
                  px-10 py-2 md:py-3 rounded-lg
                  border-b-4 border-[#3b2a1a]
                  active:border-b-0 active:translate-y-1
                  transition-all shadow-md tracking-wider
                "
              >
                Tutup Lembaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
