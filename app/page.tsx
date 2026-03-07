"use client";

import { useState } from "react";
import MainMenu from "@/components/MainMenu";
import GameScreen from "@/components/GameScreen";
import { loadGame, deleteSavedGame } from "@/lib/game";
import { GameState } from "@/types/chapter-data";
import { allStoryData } from "@/data"

export default function Home() {
  // State untuk menyimpan view aktif: 'menu' atau 'game'
  const [view, setView] = useState<'menu' | 'game'>('menu');

  // State untuk menyimpan ID scene awal yang dipilih
  const [startScene, setStartScene] = useState<string>("start");

  // State untuk saved game data
  const [savedGameData, setSavedGameData] = useState<{ sceneId: string; stats: GameState } | null>(null);

  // Fungsi saat user memilih chapter (new game)
  const handleStartGame = (sceneId: string) => {
    deleteSavedGame(); // Hapus save lama sebelum mulai baru
    setStartScene(sceneId);
    setSavedGameData(null);
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

  const handleBackToMenu = () => {
    setView('menu');
  };

  return (
    <main className="min-h-screen bg-black">
      {view === "menu" ? (
        <MainMenu
          onSelectChapter={handleStartGame}
          onContinueGame={handleContinueGame}
        />
      ) : (
        <GameScreen
          storyData={allStoryData}
          startSceneId={startScene}
          onBackToMenu={handleBackToMenu}
          savedGameData={savedGameData}
          key={startScene}
        />
      )}
    </main>
  );
}