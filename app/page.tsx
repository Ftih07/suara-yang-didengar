"use client";

import { useState } from "react";
import MainMenu from "@/components/MainMenu";
import GameScreen from "@/components/GameScreen";
import { loadGame, deleteSavedGame, getChapterFinalStats } from "@/lib/game";
import { GameState } from "@/types/chapter-data";
import { allStoryData } from "@/data";
import AudioManager from "@/lib/audioManager";


const PREV_CHAPTER: Record<string, string> = {
  ch2: "ch1",
  ch3: "ch2",
  ch4: "ch3",
  ch5: "ch4",
}

export default function Home() {
  // State untuk menyimpan view aktif: 'menu' atau 'game'
  const [view, setView] = useState<'menu' | 'game'>('menu');


  // State untuk menyimpan ID scene awal yang dipilih
  const [startScene, setStartScene] = useState<string>("start");

  // State untuk saved game data
  const [savedGameData, setSavedGameData] = useState<{ sceneId: string; stats: GameState } | null>(null);

  // Fungsi saat user memilih chapter (new game)
  const handleStartGame = (sceneId: string) => {
    deleteSavedGame();
    setStartScene(sceneId);

    // Cek apakah ada stats dari chapter sebelumnya untuk dibawa
    const chapterId = sceneId.split("_")[0];         // "ch5"
    const prevId = PREV_CHAPTER[chapterId];           // "ch4"
    const carryStats = prevId ? getChapterFinalStats(prevId) : null;

    // Jika ada, gunakan sebagai stats awal chapter baru
    setSavedGameData(carryStats ? { sceneId, stats: carryStats } : null);
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
    const audioManager = AudioManager.getInstance();
    // Stop narrator saat kembali ke menu
    audioManager.stopNarrator();
    // Play menu music
    audioManager.playBackgroundMusic('menu');
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