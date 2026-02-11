"use client";

import { useState } from "react";
import MainMenu from "@/components/MainMenu";
import GameScreen from "@/components/GameScreen";
import { loadGame } from "@/lib/game";
import { GameState } from "@/data/story";

export default function Home() {
  // State untuk menyimpan view aktif: 'menu' atau 'game'
  const [view, setView] = useState<'menu' | 'game'>('menu');

  // State untuk menyimpan ID scene awal yang dipilih
  const [startScene, setStartScene] = useState<string>("start");

  // State untuk saved game data
  const [savedGameData, setSavedGameData] = useState<{ sceneId: string; stats: GameState } | null>(null);

  // Fungsi saat user memilih chapter (new game)
  const handleStartGame = (sceneId: string) => {
    setStartScene(sceneId);
    setSavedGameData(null); // Clear saved data untuk new game
    setView('game');
  };

  // Fungsi saat user ingin continue game
  const handleContinueGame = () => {
    const saved = loadGame();
    if (saved) {
      setStartScene(saved.currentSceneId);
      setSavedGameData({
        sceneId: saved.currentSceneId,
        stats: saved.stats
      });
      setView('game');
    }
  };

  // Fungsi saat user ingin kembali ke menu
  const handleBackToMenu = () => {
    setView('menu');
  };

  return (
    <main className="min-h-screen bg-black">
      {view === 'menu' ? (
        <MainMenu
          onSelectChapter={handleStartGame}
          onContinueGame={handleContinueGame}
        />
      ) : (
        <GameScreen
          startSceneId={startScene}
          onBackToMenu={handleBackToMenu}
          savedGameData={savedGameData}
          // Kita kasih key supaya komponen mereset state saat startScene berubah
          key={startScene}
        />
      )}
    </main>
  );
}