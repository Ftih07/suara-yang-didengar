"use client";

import { useState } from "react";
import MainMenu from "@/components/MainMenu";
import GameScreen from "@/components/GameScreen";

export default function Home() {
  // State untuk menyimpan view aktif: 'menu' atau 'game'
  const [view, setView] = useState<'menu' | 'game'>('menu');
  
  // State untuk menyimpan ID scene awal yang dipilih
  const [startScene, setStartScene] = useState<string>("start");

  // Fungsi saat user memilih chapter
  const handleStartGame = (sceneId: string) => {
    setStartScene(sceneId);
    setView('game');
  };

  // Fungsi saat user ingin kembali ke menu
  const handleBackToMenu = () => {
    setView('menu');
  };

  return (
    <main className="min-h-screen bg-black">
      {view === 'menu' ? (
        <MainMenu onSelectChapter={handleStartGame} />
      ) : (
        <GameScreen 
          startSceneId={startScene} 
          onBackToMenu={handleBackToMenu}
          // Kita kasih key supaya komponen mereset state saat startScene berubah
          key={startScene} 
        />
      )}
    </main>
  );
}