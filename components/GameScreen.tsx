"use client";

import { useState } from "react";
import Image from "next/image";
import { storyData, GameState } from "../data/story";

// Tambahkan Props
type GameScreenProps = {
  startSceneId: string; // Scene awal (bisa ch1 atau ch2)
  onBackToMenu: () => void; // Fungsi buat balik ke menu
};

export default function GameScreen({ startSceneId, onBackToMenu }: GameScreenProps) {
  // Gunakan startSceneId sebagai default state
  const [currentSceneId, setCurrentSceneId] = useState<string>(startSceneId);
  
  const [stats, setStats] = useState<GameState>({
    trust: 50,
    stability: 50,
    economy: 50,
  });

  const currentScene = storyData[currentSceneId];

  const handleChoice = (nextId: string, effect?: Partial<GameState>) => {
    setCurrentSceneId(nextId);
    if (effect) {
      setStats((prev) => ({
        trust: Math.min(100, Math.max(0, prev.trust + (effect.trust || 0))),
        stability: Math.min(100, Math.max(0, prev.stability + (effect.stability || 0))),
        economy: Math.min(100, Math.max(0, prev.economy + (effect.economy || 0))),
      }));
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      
      {/* Tombol Back ke Menu (Pojok Kanan Atas) */}
      <button 
        onClick={onBackToMenu}
        className="absolute top-5 right-5 z-50 bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 rounded border border-white/20 text-sm"
      >
        Keluar ke Menu
      </button>

      {/* --- LAYER 1: BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
         <Image 
           src={currentScene.backgroundImage} 
           alt="background" 
           fill 
           className="object-cover opacity-80"
           priority
         />
      </div>

      {/* --- LAYER 2: STATS HUD --- */}
      <div className="absolute top-5 left-5 z-20 bg-slate-800/90 border-2 border-yellow-600 p-4 rounded-lg shadow-lg w-64">
        <h3 className="text-yellow-500 font-bold mb-2 uppercase tracking-wider text-sm">Status Desa</h3>
        <StatBar label="Kepercayaan" value={stats.trust} color="bg-blue-500" />
        <StatBar label="Stabilitas" value={stats.stability} color="bg-green-500" />
        <StatBar label="Ekonomi" value={stats.economy} color="bg-yellow-500" />
      </div>

      {/* --- LAYER 3: CHARACTER --- */}
      <div className="absolute bottom-0 right-0 md:right-10 z-10 w-[300px] h-[500px] md:w-[450px] md:h-[700px]">
        <Image 
          src={currentScene.characterImage} 
          alt="character" 
          fill 
          className="object-contain object-bottom drop-shadow-2xl" 
        />
      </div>

      {/* --- LAYER 4: DIALOGUE BOX --- */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-4xl">
        <div className="bg-[#E6D4B5] border-4 border-[#8B4513] rounded-xl p-6 shadow-2xl relative">
          <div className="absolute -top-5 left-5 bg-[#8B4513] text-[#E6D4B5] px-4 py-1 rounded-lg font-bold border-2 border-[#E6D4B5]">
            {currentScene.characterName}
          </div>
          <p className="text-[#3E2723] text-lg leading-relaxed mt-2 font-medium">
            {currentScene.text}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-end">
            {currentScene.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice.nextId, choice.effect)}
                className="bg-[#D2691E] hover:bg-[#A0522D] text-white px-6 py-2 rounded-lg border-b-4 border-[#8B4513] active:border-b-0 active:translate-y-1 transition-all"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
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