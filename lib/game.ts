// lib/game.ts - Game utility functions

import { GameState } from "../data/story";

export const AUTOSAVE_KEY = "desa-simulator-autosave";

export interface SaveData {
    currentSceneId: string;
    stats: GameState;
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
        const saveData: SaveData = {
            currentSceneId,
            stats,
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
