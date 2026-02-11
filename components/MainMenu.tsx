"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { hasSavedGame, loadGame } from "../lib/game";

type MainMenuProps = {
  onSelectChapter: (startId: string) => void;
  onContinueGame: () => void;
};

export default function MainMenu({ onSelectChapter, onContinueGame }: MainMenuProps) {
  const [hasSave, setHasSave] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  useEffect(() => {
    setHasSave(hasSavedGame());
  }, []);

  const handleChapterClick = (startId: string) => {
    if (hasSave) {
      // Jika ada save, tampilkan modal konfirmasi
      setSelectedChapterId(startId);
      setShowModal(true);
    } else {
      // Jika tidak ada save, langsung mulai
      onSelectChapter(startId);
    }
  };

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
    {
      id: 1,
      title: "BAB I: Dana & Dilema",
      desc: "Awal masa jabatan. Menguji integritas dalam pembagian Bansos.",
      startId: "start", // ID scene pertama di story.ts
      locked: false,
      image: "/backgrounds/kantor-desa.png" // Preview image
    },
    {
      id: 2,
      title: "BAB II: Air & Amarah",
      desc: "Musim kemarau tiba. Konflik antara Petani dan Pabrik memanas.",
      startId: "ch2_intro_good", // ID scene awal chapter 2
      locked: false, // Ubah true jika ingin dikunci
      image: "/backgrounds/demo-warga.png"
    },
  ];

  return (
    <div className="relative w-full h-screen bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden font-serif">

      {/* Background Samar */}
      <div className="absolute inset-0 opacity-30">
        <Image src="/backgrounds/kantor-desa.png" alt="bg" fill className="object-cover blur-sm" />
      </div>

      {/* Judul Game */}
      <div className="z-10 text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-bold text-[#E6D4B5] drop-shadow-lg tracking-wider mb-2">
          SUARA YANG DIDENGAR
        </h1>
        <p className="text-xl text-yellow-500 italic">Ahh sawit Ahh my Sawit yes</p>
      </div>

      {/* Continue Button (if save exists) */}
      {hasSave && (
        <div className="z-10 mb-6">
          <button
            onClick={onContinueGame}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-xl px-8 py-4 rounded-xl border-4 border-green-800 shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all duration-300 hover:scale-105"
          >
            ▶ LANJUTKAN PERMAINAN
          </button>
        </div>
      )}

      {/* Grid Chapter */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl px-4">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            disabled={chapter.locked}
            onClick={() => handleChapterClick(chapter.startId)}
            className={`
              relative group overflow-hidden rounded-xl border-4 transition-all duration-300 text-left
              ${chapter.locked
                ? "border-gray-600 grayscale opacity-50 cursor-not-allowed"
                : "border-[#8B4513] hover:scale-105 hover:shadow-[0_0_20px_rgba(230,212,181,0.5)] bg-[#2a1b12]"
              }
            `}
          >
            {/* Image Preview */}
            <div className="h-32 w-full relative">
              <Image src={chapter.image} alt={chapter.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            </div>

            {/* Text Content */}
            <div className="p-5">
              <h2 className="text-2xl font-bold text-[#E6D4B5] mb-2">{chapter.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{chapter.desc}</p>
            </div>

            {/* Lock Overlay */}
            {chapter.locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-2xl font-bold text-gray-400">TERKUNCI</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="z-10 mt-10 text-xs text-gray-500">
        v1.0.0 • Naufal Fathi • Next.js 16
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 border-4 border-yellow-600 rounded-xl p-8 max-w-md w-[90%] shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">
              ⚠️ Peringatan!
            </h2>
            <p className="text-gray-300 text-center mb-6 leading-relaxed">
              Anda memiliki <span className="text-green-400 font-bold">permainan yang tersimpan</span>.
              Apakah Anda ingin:
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleStartFresh}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-red-800 transition-all hover:scale-105 shadow-lg"
              >
                🔄 Mulai dari Awal
                <span className="block text-xs text-red-200 mt-1">(Progress lama akan tertimpa)</span>
              </button>

              <button
                onClick={handleContinueSaved}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-green-800 transition-all hover:scale-105 shadow-lg"
              >
                ▶️ Lanjutkan dari Save
                <span className="block text-xs text-green-200 mt-1">(Kembali ke progress terakhir)</span>
              </button>

              <button
                onClick={handleCloseModal}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg border-2 border-gray-800 transition-all"
              >
                ✕ Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}