"use client";

import { useState, useEffect, useRef } from "react";
import AudioManager from "@/lib/audioManager";

interface AudioControlsProps {
  visible: boolean;
  onClose?: () => void;
}

/**
 * AudioControls - Floating audio control UI
 * 
 * Features:
 * - Controlled visibility via props
 * - Replay narrator button
 * - Pause/Resume narrator button
 * - Mute background music toggle
 * - Styled dengan tema game (wood texture, sepia)
 */
export default function AudioControls({ visible, onClose }: AudioControlsProps) {
  const [bgMuted, setBgMuted] = useState(false);
  const [narratorPlaying, setNarratorPlaying] = useState(false);
  const [hasNarrator, setHasNarrator] = useState(false);
  
  const checkIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const audioManager = AudioManager.getInstance();

  // Check narrator status periodically
  useEffect(() => {
    const manager = audioManager;
    checkIntervalRef.current = setInterval(() => {
      setNarratorPlaying(manager.isNarratorPlaying());
      setHasNarrator(manager.hasNarrator());
    }, 500);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Initialize mute status
  useEffect(() => {
    setBgMuted(audioManager.isBgMuted());
  }, []);

  const handleToggleBgMute = () => {
    const newMutedState = audioManager.toggleBgMute();
    setBgMuted(newMutedState);
  };

  const handleReplayNarrator = () => {
    audioManager.replayNarrator();
  };

  const handleToggleNarrator = () => {
    if (narratorPlaying) {
      audioManager.pauseNarrator();
    } else {
      audioManager.resumeNarrator();
    }
  };

  return (
    <div
      className={`fixed bottom-20 right-6 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      }`}
    >
      <div
        className="flex flex-col gap-3 bg-[#3a2517]/95 backdrop-blur-sm rounded-xl border-2 border-[#8B4513] shadow-2xl p-4"
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Title */}
        <div className="text-[#ebcca5] text-xs font-bold uppercase tracking-wider text-center border-b border-[#8B4513]/50 pb-2 mb-1">
          Audio Controls
        </div>

        <div className="flex gap-3">
          {/* Narrator Replay Button */}
          <button
            onClick={handleReplayNarrator}
            disabled={!hasNarrator}
            className={`relative w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
              hasNarrator
                ? "bg-[#5e3a21] border-[#8B4513] hover:bg-[#7a4a2f] hover:scale-110 active:scale-95 cursor-pointer"
                : "bg-[#2a1810] border-[#5e3a21] opacity-40 cursor-not-allowed"
            }`}
            title={hasNarrator ? "Replay Narrator" : "No narrator available"}
          >
            <span className="text-2xl">🔊</span>
            {hasNarrator && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-[#3a2517] animate-pulse" />
            )}
          </button>

          {/* Narrator Play/Pause Button */}
          <button
            onClick={handleToggleNarrator}
            disabled={!hasNarrator}
            className={`relative w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
              hasNarrator
                ? "bg-[#5e3a21] border-[#8B4513] hover:bg-[#7a4a2f] hover:scale-110 active:scale-95 cursor-pointer"
                : "bg-[#2a1810] border-[#5e3a21] opacity-40 cursor-not-allowed"
            }`}
            title={
              !hasNarrator
                ? "No narrator available"
                : narratorPlaying
                  ? "Pause Narrator"
                  : "Resume Narrator"
            }
          >
            <span className="text-2xl">{narratorPlaying ? "⏸️" : "▶️"}</span>
          </button>

          {/* BG Music Mute Toggle */}
          <button
            onClick={handleToggleBgMute}
            className="relative w-12 h-12 rounded-lg border-2 bg-[#5e3a21] border-[#8B4513] hover:bg-[#7a4a2f] transition-all duration-200 hover:scale-110 active:scale-95"
            title={bgMuted ? "Unmute Background Music" : "Mute Background Music"}
          >
            <span className="text-2xl">{bgMuted ? "🔇" : "🔉"}</span>
          </button>
        </div>

        {/* Visual indicator untuk narrator playing */}
        {narratorPlaying && (
          <div className="flex items-center justify-center gap-1 pt-1">
            <div className="w-1 h-3 bg-[#ebcca5] rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-1 h-4 bg-[#ebcca5] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-1 h-3 bg-[#ebcca5] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* Hint text */}
        <div className="text-[#8B4513] text-[10px] text-center mt-1">
          {hasNarrator ? "Narrator Active" : "No Narrator"}
        </div>
      </div>
    </div>
  );
}
