// lib/audioManager.ts
// Singleton Audio Manager untuk mengelola background music dan narrator
// Menggunakan Howler.js untuk audio playback yang robust

import { Howl, Howler } from 'howler';

type BackgroundMood = 'menu' | 'calm' | 'tense'  ;

/**
 * AudioManager - Singleton class untuk mengelola semua audio dalam game
 * 
 * Features:
 * - Background music dengan auto-loop
 * - Narrator audio dengan autoplay
 * - Mute/unmute controls
 * - Volume controls
 * - Smooth fade in/out transitions
 * - Proper cleanup untuk prevent memory leaks
 */
class AudioManager {
  private static instance: AudioManager;
  
  // Audio instances
  private bgMusic: Howl | null = null;
  private narrator: Howl | null = null;
  
  // State tracking
  private currentBgMood: BackgroundMood | null = null;
  private bgMuted: boolean = false;
  private narratorMuted: boolean = false;
  private bgVolume: number = 0.5;
  private narratorVolume: number = 0.8;
  private audioContextResumed: boolean = false;
  
  // Audio file mappings
  private readonly BG_MUSIC_MAP: Record<BackgroundMood, string> = {
    menu: '/audio/bg-menu.mp3',
    calm: '/audio/bg-calm.mp3',
    tense: '/audio/bg-tense.mp3',
  };

  private constructor() {
    // Load mute preferences from localStorage
    if (typeof window !== 'undefined') {
      const savedBgMute = localStorage.getItem('bgMusicMuted');
      const savedNarratorMute = localStorage.getItem('narratorMuted');
      this.bgMuted = savedBgMute === 'true';
      this.narratorMuted = savedNarratorMute === 'true';
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Resume AudioContext untuk unlock autoplay restrictions
   * Harus dipanggil setelah user gesture (click, tap, keyboard)
   */
  public async resumeAudioContext(): Promise<void> {
    if (this.audioContextResumed) {
      return;
    }

    try {
      // Resume Howler's global AudioContext jika suspended
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        await Howler.ctx.resume();
      }
      this.audioContextResumed = true;
    } catch (error) {
      console.warn('Failed to resume AudioContext:', error);
    }
  }

  /**
   * Helper untuk cleanup background music dengan Promise
   */
  private cleanupBgMusic(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.bgMusic) {
        resolve();
        return;
      }

      const currentVolume = this.bgMusic.volume();
      this.bgMusic.fade(currentVolume, 0, 300);
      
      setTimeout(() => {
        this.bgMusic?.stop();
        this.bgMusic?.unload();
        this.bgMusic = null;
        resolve();
      }, 300);
    });
  }

  /**
   * Play background music berdasarkan mood
   * Akan restart jika mood berbeda, atau continue jika mood sama
   */
  public async playBackgroundMusic(mood: BackgroundMood): Promise<void> {
    // Jika sudah playing music dengan mood yang sama, skip
    if (this.currentBgMood === mood && this.bgMusic && this.bgMusic.playing()) {
      return;
    }

    // Cleanup previous music dengan await untuk prevent race condition
    await this.cleanupBgMusic();

    // Create new music instance
    this.bgMusic = new Howl({
      src: [this.BG_MUSIC_MAP[mood]],
      loop: true,
      volume: this.bgMuted ? 0 : this.bgVolume,
      html5: false, // Gunakan Web Audio API untuk file kecil
      autoplay: false, // Explicit control
      format: ['mp3'],
    });

    // Play dan fade in
    this.bgMusic.play();
    if (!this.bgMuted) {
      this.bgMusic.fade(0, this.bgVolume, 1000);
    }
    
    this.currentBgMood = mood;
  }

  /**
   * Stop background music dengan fade out
   */
  public async stopBackgroundMusic(): Promise<void> {
    await this.cleanupBgMusic();
    this.currentBgMood = null;
  }

  /**
   * Play narrator audio
   * @param audioPath - Path relatif dari /audio/ (e.g., 'narrator-ch1-intro.mp3')
   */
  public playNarrator(audioPath: string): void {
    // Stop previous narrator jika ada
    this.stopNarrator();

    // Create new narrator instance
    this.narrator = new Howl({
      src: [`/audio/${audioPath}`],
      volume: this.narratorMuted ? 0 : this.narratorVolume,
      html5: false, // Gunakan Web Audio API untuk efisiensi
      pool: 1, // Reuse 1 instance untuk prevent pool exhaustion
      autoplay: false,
      format: ['mp3'],
      onend: () => {
        // Auto cleanup setelah selesai
        this.narrator?.unload();
      },
    });

    this.narrator.play();
  }

  /**
   * Stop narrator audio
   */
  public stopNarrator(): void {
    if (!this.narrator) return;
    
    this.narrator.stop();
    this.narrator.unload();
    this.narrator = null;
  }

  /**
   * Pause narrator audio (untuk kontrol manual)
   */
  public pauseNarrator(): void {
    if (this.narrator && this.narrator.playing()) {
      this.narrator.pause();
    }
  }

  /**
   * Resume narrator audio
   */
  public resumeNarrator(): void {
    if (this.narrator && !this.narrator.playing()) {
      this.narrator.play();
    }
  }

  /**
   * Replay narrator dari awal (jika ada narrator yang sedang/baru dimainkan)
   */
  public replayNarrator(): void {
    if (this.narrator) {
      this.narrator.stop();
      this.narrator.play();
    }
  }

  /**
   * Toggle mute untuk background music
   */
  public toggleBgMute(): boolean {
    this.bgMuted = !this.bgMuted;
    
    if (this.bgMusic) {
      this.bgMusic.volume(this.bgMuted ? 0 : this.bgVolume);
    }

    // Save preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgMusicMuted', String(this.bgMuted));
    }

    return this.bgMuted;
  }

  /**
   * Toggle mute untuk narrator
   */
  public toggleNarratorMute(): boolean {
    this.narratorMuted = !this.narratorMuted;
    
    if (this.narrator) {
      this.narrator.volume(this.narratorMuted ? 0 : this.narratorVolume);
    }

    // Save preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('narratorMuted', String(this.narratorMuted));
    }

    return this.narratorMuted;
  }

  /**
   * Set volume untuk background music (0.0 - 1.0)
   */
  public setBgVolume(volume: number): void {
    this.bgVolume = Math.max(0, Math.min(1, volume));
    
    if (this.bgMusic && !this.bgMuted) {
      this.bgMusic.volume(this.bgVolume);
    }
  }

  /**
   * Set volume untuk narrator (0.0 - 1.0)
   */
  public setNarratorVolume(volume: number): void {
    this.narratorVolume = Math.max(0, Math.min(1, volume));
    
    if (this.narrator && !this.narratorMuted) {
      this.narrator.volume(this.narratorVolume);
    }
  }

  /**
   * Check apakah narrator sedang playing
   */
  public isNarratorPlaying(): boolean {
    if (!this.narrator) return false;
    return this.narrator.playing();
  }

  /**
   * Check apakah background music sedang playing
   */
  public isBgMusicPlaying(): boolean {
    if (!this.bgMusic) return false;
    return this.bgMusic.playing();
  }

  /**
   * Get mute status
   */
  public isBgMuted(): boolean {
    return this.bgMuted;
  }

  public isNarratorMuted(): boolean {
    return this.narratorMuted;
  }

  /**
   * Check apakah ada narrator instance (untuk enable/disable replay button)
   */
  public hasNarrator(): boolean {
    return this.narrator !== null;
  }

  /**
   * Cleanup semua audio (untuk unmount/cleanup)
   */
  public cleanup(): void {
    this.stopBackgroundMusic();
    this.stopNarrator();
  }
}

// Export singleton instance
export default AudioManager;
