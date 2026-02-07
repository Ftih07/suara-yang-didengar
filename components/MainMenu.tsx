"use client";

import Image from "next/image";

type MainMenuProps = {
  onSelectChapter: (startId: string) => void;
};

export default function MainMenu({ onSelectChapter }: MainMenuProps) {
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

      {/* Grid Chapter */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl px-4">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            disabled={chapter.locked}
            onClick={() => onSelectChapter(chapter.startId)}
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
    </div>
  );
}