// lib/game.ts - Game utility functions

import { GameState } from "@/types/chapter-data";


export const AUTOSAVE_KEY = "desa-simulator-autosave";
export const PLAYED_CHAPTERS_KEY = "desa-simulator-played-chapters";
export const CHAPTER_STATS_KEY = "desa-simulator-chapter-stats";

export interface SaveData {
    currentSceneId: string;
    stats: GameState;
    timestamp: number;
    chapterId: string;     // Prefix chapter, e.g. "ch4"
    chapterTitle?: string; // Judul chapter untuk display di continue screen
}

export interface ChapterCompletion {
    chapterId: string;
    finalStats: GameState;
    timestamp: number;
}



/**
 * Load saved game from localStorage
 * @returns SaveData or null if no save exists
 */
export const loadGame = (): SaveData | null => {
    try {
        if (typeof window === "undefined") return null;

        const saved = localStorage.getItem(AUTOSAVE_KEY);
        if (!saved) return null;

        return JSON.parse(saved) as SaveData;
    } catch (error) {
        console.error("Failed to load game:", error);
        return null;
    }
};

/**
 * Save game to localStorage
 * @param currentSceneId - Current scene ID
 * @param stats - Game stats
 */
export const saveGame = (currentSceneId: string, stats: GameState): void => {
    try {
        if (typeof window === "undefined") return;

        const saveData: SaveData = {
            currentSceneId,
            stats,
            chapterId: currentSceneId.split("_")[0], // Extract chapter ID from scene ID
            timestamp: Date.now(),
        };
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(saveData));
    } catch (error) {
        console.error("Failed to save game:", error);
    }
};

/**
 * Check if a saved game exists
 * @returns boolean
 */
export const hasSavedGame = (): boolean => {
    try {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(AUTOSAVE_KEY) !== null;
    } catch {
        return false;
    }
};

/**
 * Delete saved game from localStorage
 */
export const deleteSavedGame = (): void => {

    try {



        localStorage.removeItem(AUTOSAVE_KEY);
    } catch (error) {
        console.error("Failed to delete saved game:", error);
    }
};

export const getPlayedChapters = (): string[] => {
    try {
        if (typeof window === "undefined") return [];

        const saved = localStorage.getItem(PLAYED_CHAPTERS_KEY);

        if (!saved) return [];

        return JSON.parse(saved) as string[];
    } catch (error) {
        console.error("Failed to get played chapters:", error);
        return [];
    }
}

export const getChapterCompletions = (): ChapterCompletion[] => {
    try {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem(CHAPTER_STATS_KEY);
        if (!saved) return [];
        return JSON.parse(saved) as ChapterCompletion[];
    } catch {
        return [];
    }
}

export const getChapterFinalStats = (chapterId: string): GameState | null => {
    const completions = getChapterCompletions();
    const found = completions.find(c => c.chapterId === chapterId);
    return found ? found.finalStats : null;
};

export const markChapterPlayed = (chapterId: string, finalStats: GameState): void => {
    try {
        if (typeof window === "undefined") return;

        // Simpan stats akhir chapter
        const completions = getChapterCompletions();
        const existing = completions.findIndex(c => c.chapterId === chapterId);
        const entry: ChapterCompletion = { chapterId, finalStats, timestamp: Date.now() };
        if (existing >= 0) completions[existing] = entry;
        else completions.push(entry);
        localStorage.setItem(CHAPTER_STATS_KEY, JSON.stringify(completions));

        // Simpan daftar chapter yang sudah dimainkan
        const played = getPlayedChapters();
        if (!played.includes(chapterId)) {
            played.push(chapterId);
            localStorage.setItem(PLAYED_CHAPTERS_KEY, JSON.stringify(played));
        }
    } catch (error) {
        console.error("Failed to mark chapter as played:", error);
    }
};

/**
 * FITUR TAMBAHAN: Hapus TOTAL semua data (Cocok buat tombol Reset di menu Pengaturan)
 */
export const hardResetGame = (): void => {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTOSAVE_KEY);
    localStorage.removeItem(PLAYED_CHAPTERS_KEY);
    localStorage.removeItem(CHAPTER_STATS_KEY);
  } catch (error) {
    console.error("Failed to hard reset game:", error);
  }
};
