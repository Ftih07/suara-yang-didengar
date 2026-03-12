"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { hasSavedGame, loadGame, getPlayedChapters } from "../lib/game";

type MainMenuProps = {
  onSelectChapter: (startId: string) => void;
  onContinueGame: () => void;
};

export default function MainMenu({ onSelectChapter, onContinueGame }: MainMenuProps) {
  const [hasSave, setHasSave] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [menuView, setMenuView] = useState<'main' | 'chapterSelect'>('main');
  const [playedChapters, setPlayedChapters] = useState<string[]>([]);

  useEffect(() => {
    setHasSave(hasSavedGame());
    setPlayedChapters(getPlayedChapters());
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

  const chapters = [
    { id: 1, title: "Chapter 1", startId: "ch1_intro", locked: true },  // belum ada data
    { id: 2, title: "Chapter 2", startId: "ch2_intro", locked: !playedChapters.includes("ch1") },  // belum ada data
    { id: 3, title: "Chapter 3", startId: "ch3_intro", locked: !playedChapters.includes("ch2") },  // belum ada data
    { id: 4, title: "Chapter 4", startId: "ch4_intro", locked: !playedChapters.includes("ch3") }, // selalu terbuka
    { id: 5, title: "Chapter 5", startId: "ch5_intro", locked: !playedChapters.includes("ch4") },
    { id: 6, title: "Chapter 6", startId: "ch6_intro", locked: true },
    { id: 7, title: "Chapter 7", startId: "ch7_intro", locked: true },
    { id: 8, title: "Chapter 8", startId: "ch8_intro", locked: true },
  ];

  const handleChapterClick = (chapter: { locked: boolean; startId: string }) => {
    if (chapter.locked) return;
    if (hasSave) {
      setSelectedChapterId(chapter.startId);
      setShowModal(true);
    } else {
      onSelectChapter(chapter.startId);
    }
  };

  const WoodButton = ({ children, onClick, width = "w-[340px]", className = "" }: any) => (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center h-[76px] ${width} group transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <Image src="/ui/txt box 1.png" alt="btn bg" fill className="object-fill drop-shadow-xl pointer-events-none" unoptimized />
      <span
        className="relative z-10 text-[26px] font-bold tracking-widest uppercase mt-1"
        style={{
          color: "#5e3a21",
          textShadow: "1px 1px 0px #ebcca5, -1px -1px 0px #ebcca5, 1px -1px 0px #ebcca5, -1px 1px 0px #ebcca5",
          fontFamily: "Georgia, serif"
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
          src="/backgrounds/bg-blur-desa.png"
          alt="bg"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Slightly darken to make UI stand out */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {menuView === 'main' && (
        <div className="relative z-10 flex flex-col items-center w-full h-full pt-16">

          {/* Top Left Character Icon */}
          <div className="absolute top-6 left-6 w-20 h-20 bg-[#3d271d] border-4 border-[#24150e] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            <Image src="/characters/kades-normal.png" alt="Profile" width={80} height={80} className="object-cover scale-150 mt-4" unoptimized />
          </div>

          {/* Title */}
          <div className="mb-14">
            <h1
              className="text-6xl md:text-[80px] font-black tracking-widest text-[#5e3a21] text-center px-4"
              style={{
                fontFamily: "Georgia, serif",
                WebkitTextStroke: "3px #ebcca5",
                textShadow: "6px 6px 12px rgba(0,0,0,0.6)"
              }}
            >
              SUARA YANG DIDENGAR
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-6 items-center">
            {hasSave && (
              <WoodButton onClick={handleContinueSaved}>
                LANJUTKAN
              </WoodButton>
            )}
            <WoodButton onClick={() => setMenuView('chapterSelect')}>
              MAIN CHAPTER
            </WoodButton>
            <WoodButton onClick={() => { }}>
              STATUS DESA
            </WoodButton>
            <WoodButton onClick={() => { }}>
              PENGATURAN
            </WoodButton>
            <WoodButton onClick={() => { }}>
              KREDIT
            </WoodButton>
          </div>

        </div>
      )}

      {menuView === 'chapterSelect' && (
        <div className="relative z-10 flex flex-col items-center w-full h-full pt-12">

          {/* Back Button */}
          <button
            onClick={() => setMenuView('main')}
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
              fontFamily: "Georgia, serif"
            }}
          >
            Mainkan Chapter
          </h2>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-[800px] px-6">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter)}
                disabled={chapter.locked}
                className={`relative flex items-center h-[76px] w-full transition-all duration-300 ${chapter.locked
                  ? "opacity-60 cursor-not-allowed contrast-75"
                  : "hover:scale-105 active:scale-95 cursor-pointer"
                  }`}
              >
                <Image src="/ui/txt box 1.png" alt="btn bg" fill className="object-fill drop-shadow-xl pointer-events-none" unoptimized />

                {/* Icon inside button (book or lock) */}
                <div className="relative z-10 ml-6 flex items-center justify-center w-10">
                  {chapter.locked ? (
                    <Image src="/ui/lock 1.png" alt="lock" width={32} height={32} unoptimized />
                  ) : (
                    <Image src="/ui/book 9.png" alt="book" width={42} height={42} unoptimized />
                  )}
                </div>

                {/* Chapter Title */}
                <span
                  className="relative z-10 text-[26px] font-bold ml-6 mt-1"
                  style={{
                    color: "#5e3a21",
                    textShadow: "1px 1px 0px #ebcca5, -1px -1px 0px #ebcca5, 1px -1px 0px #ebcca5, -1px 1px 0px #ebcca5",
                    fontFamily: "Georgia, serif"
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

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-[400px] bg-[#3a2517] rounded-xl border-4 border-[#8B4513] shadow-2xl p-6 flex flex-col items-center">
            <div className="absolute inset-0 bg-[url('/backgrounds/kantor-desa.png')] bg-cover opacity-10 rounded-lg pointer-events-none" />

            <h2 className="relative z-10 text-2xl font-bold text-[#ebcca5] mb-4 text-center">
              Perhatian!
            </h2>
            <p className="relative z-10 text-[#ebcca5] text-center mb-8">
              Memulai permainan baru akan <b>menimpa</b> progres Anda sebelumnya. Apakah Anda yakin?
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
    </div>
  );
}