# 🎵 Audio System Documentation

Dokumentasi lengkap untuk sistem audio game **Suara Yang Didengar** menggunakan Howler.js.

---

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Quick Start - Cara Menambahkan Audio](#quick-start---cara-menambahkan-audio)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [File Structure](#file-structure)
5. [Audio Files](#audio-files)
6. [Implementasi](#implementasi)
7. [Panduan Lengkap: Menambahkan Audio ke Game](#panduan-lengkap-menambahkan-audio-ke-game)
8. [Audio Normalization Guide](#audio-normalization-guide)
9. [Automation Scripts](#automation-scripts)
10. [API Reference](#api-reference)
11. [Usage Guide](#usage-guide)
12. [Troubleshooting](#troubleshooting)

---

## Overview

Sistem audio ini menyediakan:
- **Background Music** dengan 3 mood (menu, calm, tense)
- **Narrator Audio** untuk scene intro dan conclusion setiap chapter
- **Autoplay** dengan kontrol manual (play, pause, replay, mute)
- **Auto-hide UI** yang muncul saat hover/touch
- **Persistent preferences** (mute status disimpan di localStorage)
- **Smooth transitions** dengan fade in/out

### Teknologi yang Digunakan:
- **Howler.js** v2.2.4 - Audio library
- **TypeScript** - Type safety
- **React Hooks** - State management
- **LocalStorage** - Preference persistence

---

## Quick Start - Cara Menambahkan Audio

> 🚀 **Panduan cepat 5 menit untuk menambahkan audio ke scene baru**

### Prasyarat
- ✅ File audio dalam format **MP3**
- ✅ Audio sudah di-**normalize** (atau gunakan script `normalize-audio.ps1`)
- ✅ Nama file mengikuti konvensi: `narrator-chX-[intro|conclusion].mp3`

### Langkah-Langkah

#### 1️⃣ Siapkan File Audio
```bash
# Letakkan file MP3 di folder public/audio/
# Contoh:
public/audio/narrator-ch6-intro.mp3
public/audio/narrator-ch6-conclusion.mp3
```

#### 2️⃣ Normalize Volume Audio (Opsional tapi Disarankan)
```powershell
# Jalankan script normalization
.\normalize-audio.ps1 -Backup

# Atau normalize file spesifik dengan ffmpeg:
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11 output.mp3
```

#### 3️⃣ Update Chapter Data
Buka file chapter data (misalnya `data/chapter-6.ts`) dan tambahkan field audio:

```typescript
ch6_intro: {
  id: "ch6_intro",
  backgroundImage: BG_IMAGE,
  characterImage: "",
  characterName: "Narasi",
  text: "Ini adalah scene intro chapter 6...",
  nextSceneId: "ch6_scene_1",
  backgroundMusic: "calm",                      // 👈 TAMBAHKAN INI
  narratorAudio: "narrator-ch6-intro.mp3",      // 👈 TAMBAHKAN INI
},

ch6_scene_1: {
  id: "ch6_scene_1",
  backgroundImage: BG_IMAGE,
  characterImage: CHAR_IMAGE,
  characterName: "Karakter",
  text: "Dialog karakter...",
  nextSceneId: "ch6_scene_2",
  backgroundMusic: "tense",                     // 👈 Musik berubah ke tense
  // Tidak ada narratorAudio = narrator berhenti otomatis
},
```

#### 4️⃣ Test di Browser
```bash
npm run dev
# Buka http://localhost:3000
# Navigate ke chapter yang baru ditambahkan
# Audio seharusnya autoplay!
```

#### 5️⃣ Verifikasi dengan Script
```powershell
# Cek apakah semua audio files valid
.\verify-audio.ps1 -Detailed
```

### ✅ Selesai!
Audio sekarang akan:
- ✅ **Autoplay** saat scene muncul
- ✅ **Stop otomatis** saat pindah ke scene tanpa narrator
- ✅ **Bisa di-replay/pause** menggunakan AudioControls UI

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERFACE                       │
│  (MainMenu.tsx, GameScreen.tsx, AudioControls.tsx)     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               AudioManager (Singleton)                   │
│  - playBackgroundMusic(mood)                            │
│  - playNarrator(path)                                   │
│  - toggleBgMute()                                       │
│  - stopNarrator()                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Howler.js Library                      │
│  - Audio playback                                       │
│  - Volume control                                       │
│  - Loop management                                      │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

```
suara-yang-didengar/
├── public/
│   └── audio/                      # Audio files
│       ├── bg-menu.mp3            # Menu background music
│       ├── bg-calm.mp3            # Calm scene music
│       ├── bg-tense.mp3           # Tense scene music
│       ├── narrator-ch1-intro.mp3
│       ├── narrator-ch1-conclusion.mp3
│       ├── narrator-ch2-intro.mp3
│       ├── narrator-ch2-conclusion.mp3
│       ├── narrator-ch3-intro.mp3
│       ├── narrator-ch3-conclusion.mp3
│       ├── narrator-ch4-intro.mp3
│       ├── narrator-ch4-conclusion.mp3
│       ├── narrator-ch5-intro.mp3
│       └── narrator-ch5-conclusion.mp3
│
├── lib/
│   └── audioManager.ts            # Singleton Audio Manager
│
├── components/
│   ├── AudioControls.tsx          # Audio control UI
│   ├── MainMenu.tsx               # Menu with BG music
│   └── GameScreen.tsx             # Game with dynamic audio
│
├── data/
│   ├── chapter-1.ts               # + audio mapping
│   ├── chapter-2.ts               # + audio mapping
│   ├── chapter-3.ts               # + audio mapping
│   ├── chapter-4.ts               # + audio mapping
│   └── chapter-5.ts               # + audio mapping
│
├── types/
│   └── chapter-data.ts            # + audio fields
│
└── AUDIO_SYSTEM.md                # This file
```

---

## Audio Files

### Background Music (3 files)

| File | Mood | Usage | Loop |
|------|------|-------|------|
| `bg-menu.mp3` | Menu | Main menu screen | ✅ Yes |
| `bg-calm.mp3` | Calm | Intro, narasi, resolusi, scene damai | ✅ Yes |
| `bg-tense.mp3` | Tense | Konflik, perdebatan, keputusan sulit | ✅ Yes |

### Narrator Audio (11 files)

| File | Chapter | Scene | Autoplay |
|------|---------|-------|----------|
| `narrator-ch1-intro.mp3` | 1 | ch1_intro | ✅ Yes |
| `narrator-ch1-conclusion.mp3` | 1 | ch1_c_laras_1 | ✅ Yes |
| `narrator-ch2-intro.mp3` | 2 | ch2_intro | ✅ Yes |
| `narrator-ch2-conclusion.mp3` | 2 | ch2_ending | ✅ Yes |
| `narrator-ch3-intro.mp3` | 3 | ch3_intro | ✅ Yes |
| `narrator-ch3-conclusion.mp3` | 3 | ch3_ending | ✅ Yes |
| `narrator-ch4-intro.mp3` | 4 | ch4_intro | ✅ Yes |
| `narrator-ch4-conclusion.mp3` | 4 | ch4_conclusion_laras | ✅ Yes |
| `narrator-ch5-intro.mp3` | 5 | ch5_intro | ✅ Yes |
| `narrator-ch5-conclusion.mp3` | 5 | chA_end | ✅ Yes |

**Note:** `narasi cp4 #3.mp3` tidak digunakan dalam implementasi saat ini.

---

## Implementasi

### 1. Type Definitions (`types/chapter-data.ts`)

```typescript
export type ChapterData = {
  id: string;
  backgroundImage?: string;
  characterImage?: string;
  characterName: string;
  text: string;
  nextSceneId?: string;
  choices?: Choice[];
  backgroundMusic?: 'calm' | 'tense';  // NEW
  narratorAudio?: string;              // NEW
};
```

### 2. Audio Manager (`lib/audioManager.ts`)

Singleton class yang mengelola semua audio:

```typescript
const audioManager = AudioManager.getInstance();

// Play background music
audioManager.playBackgroundMusic('menu');  // or 'calm', 'tense'

// Play narrator
audioManager.playNarrator('narrator-ch1-intro.mp3');

// Controls
audioManager.toggleBgMute();      // Mute/unmute BG music
audioManager.pauseNarrator();     // Pause narrator
audioManager.resumeNarrator();    // Resume narrator
audioManager.replayNarrator();    // Replay from start
audioManager.stopNarrator();      // Stop & cleanup

// State checks
audioManager.isNarratorPlaying(); // Returns boolean
audioManager.isBgMusicPlaying();  // Returns boolean
audioManager.hasNarrator();       // Returns boolean
```

### 3. Chapter Data Mapping

Contoh mapping di `data/chapter-1.ts`:

```typescript
ch1_intro: {
  id: "ch1_intro",
  backgroundImage: BG_BALAI_DESA_DALAM,
  characterImage: "",
  characterName: "Narasi",
  text: "Pagi yang riuh di Balai Desa Amanah...",
  nextSceneId: "ch1_bayu_1",
  backgroundMusic: "calm",                    // ✅ Calm music
  narratorAudio: "narrator-ch1-intro.mp3",   // ✅ Narrator
},

ch1_bayu_1: {
  id: "ch1_bayu_1",
  backgroundImage: BG_BALAI_DESA_DALAM,
  characterImage: CHAR_BAYU,
  characterName: "Bayu",
  text: "(Menggebrak meja perlahan) Bapak-bapak...",
  nextSceneId: "ch1_laras_1",
  backgroundMusic: "tense",                   // ✅ Tense music (konflik!)
},
```

### 4. MainMenu Integration (`components/MainMenu.tsx`)

```typescript
useEffect(() => {
  const audioManager = AudioManager.getInstance();
  audioManager.playBackgroundMusic('menu');
  
  return () => {
    // Cleanup handled by GameScreen
  };
}, []);
```

### 5. GameScreen Integration (`components/GameScreen.tsx`)

```typescript
useEffect(() => {
  const audioManager = AudioManager.getInstance();
  
  // Play BG music jika scene memiliki field
  if (currentScene.backgroundMusic) {
    audioManager.playBackgroundMusic(currentScene.backgroundMusic);
  }
  
  // Play narrator jika scene memiliki field
  if (currentScene.narratorAudio) {
    audioManager.playNarrator(currentScene.narratorAudio);
  } else {
    audioManager.stopNarrator();
  }
  
  return () => {
    if (showEnding) {
      audioManager.cleanup();
    }
  };
}, [currentSceneId, currentScene, showEnding]);
```

### 6. Audio Controls UI (`components/AudioControls.tsx`)

Floating control panel dengan:
- 🔊 Replay narrator button
- ▶️/⏸️ Play/Pause narrator button
- 🔉/🔇 Mute BG music toggle
- Auto-hide setelah 3 detik idle

---

## API Reference

### AudioManager Class

#### Constructor
```typescript
private constructor()
```
Private constructor (singleton pattern). Use `getInstance()` instead.

#### Static Methods

##### `getInstance()`
```typescript
static getInstance(): AudioManager
```
Returns singleton instance of AudioManager.

#### Instance Methods

##### `playBackgroundMusic(mood)`
```typescript
playBackgroundMusic(mood: 'menu' | 'calm' | 'tense'): void
```
Plays background music dengan mood specified. Auto-loop enabled.
- Jika mood sama dan sudah playing, skip (no restart)
- Jika mood berbeda, fade out old → fade in new

##### `stopBackgroundMusic()`
```typescript
stopBackgroundMusic(): void
```
Stops background music dengan fade out animation.

##### `playNarrator(audioPath)`
```typescript
playNarrator(audioPath: string): void
```
Plays narrator audio. Parameter adalah nama file tanpa `/audio/` prefix.
- Example: `playNarrator('narrator-ch1-intro.mp3')`
- Auto-stops previous narrator if playing

##### `stopNarrator()`
```typescript
stopNarrator(): void
```
Stops narrator dan unload audio dari memory.

##### `pauseNarrator()`
```typescript
pauseNarrator(): void
```
Pauses narrator (can be resumed).

##### `resumeNarrator()`
```typescript
resumeNarrator(): void
```
Resumes paused narrator.

##### `replayNarrator()`
```typescript
replayNarrator(): void
```
Replays narrator dari awal.

##### `toggleBgMute()`
```typescript
toggleBgMute(): boolean
```
Toggle mute untuk background music. Returns new muted state.
- Saves preference to localStorage

##### `toggleNarratorMute()`
```typescript
toggleNarratorMute(): boolean
```
Toggle mute untuk narrator. Returns new muted state.
- Saves preference to localStorage

##### `setBgVolume(volume)`
```typescript
setBgVolume(volume: number): void
```
Set volume untuk background music (0.0 - 1.0).

##### `setNarratorVolume(volume)`
```typescript
setNarratorVolume(volume: number): void
```
Set volume untuk narrator (0.0 - 1.0).

##### `isNarratorPlaying()`
```typescript
isNarratorPlaying(): boolean
```
Returns `true` jika narrator sedang playing.

##### `isBgMusicPlaying()`
```typescript
isBgMusicPlaying(): boolean
```
Returns `true` jika background music sedang playing.

##### `isBgMuted()`
```typescript
isBgMuted(): boolean
```
Returns `true` jika background music di-mute.

##### `isNarratorMuted()`
```typescript
isNarratorMuted(): boolean
```
Returns `true` jika narrator di-mute.

##### `hasNarrator()`
```typescript
hasNarrator(): boolean
```
Returns `true` jika ada narrator instance (untuk enable/disable controls).

##### `cleanup()`
```typescript
cleanup(): void
```
Cleanup semua audio instances. Call saat unmount atau exit game.

---

## Usage Guide

### Menambahkan Audio ke Scene Baru

1. **Tentukan mood scene:**
   - Intro, narasi, resolusi → `'calm'`
   - Konflik, perdebatan, keputusan → `'tense'`

2. **Update chapter data file:**
   ```typescript
   your_new_scene: {
     id: "your_new_scene",
     // ... existing fields
     backgroundMusic: "tense",  // ✅ Add this
   },
   ```

3. **Untuk scene dengan narrator:**
   ```typescript
   your_intro_scene: {
     id: "your_intro_scene",
     characterName: "Narasi",
     // ... existing fields
     backgroundMusic: "calm",
     narratorAudio: "narrator-ch6-intro.mp3",  // ✅ Add this
   },
   ```

4. **Tambahkan audio file:**
   - Place file di `/public/audio/`
   - Nama file: `narrator-chX-[intro|conclusion].mp3`

### Mengubah Behavior Audio

#### Disable autoplay narrator:
```typescript
// Di GameScreen.tsx, comment out:
if (currentScene.narratorAudio) {
  audioManager.playNarrator(currentScene.narratorAudio);
}
```

#### Change fade duration:
```typescript
// Di audioManager.ts:
this.bgMusic.fade(0, this.bgVolume, 1000);  // ← Change 1000 to desired ms
```

#### Change default volumes:
```typescript
// Di audioManager.ts constructor:
private bgVolume: number = 0.5;        // 0.0 - 1.0
private narratorVolume: number = 0.8;  // 0.0 - 1.0
```

### Testing Audio

1. **Test MainMenu:**
   ```bash
   npm run dev
   ```
   → Menu music should autoplay

2. **Test Chapter 1:**
   - Start Chapter 1
   - Verify intro narrator plays
   - Verify music switches to tense during konflik
   - Verify conclusion narrator plays

3. **Test Controls:**
   - Hover bottom-right → controls appear
   - Click 🔊 → narrator replays
   - Click 🔇 → music mutes
   - Wait 3s → controls auto-hide

---

## Panduan Lengkap: Menambahkan Audio ke Game

> 📚 **Panduan detail untuk berbagai skenario penambahan audio**

### Skenario 1: Menambahkan Background Music ke Scene yang Sudah Ada

Jika Anda ingin menambahkan background music ke scene yang sebelumnya tidak memiliki audio:

#### Step 1: Tentukan Mood yang Tepat

Pilih mood berdasarkan konteks scene:

| Mood | Kapan Digunakan | Contoh Scene |
|------|-----------------|--------------|
| `'calm'` | Scene tenang, narasi, intro, resolusi | Pembukaan chapter, scene perdamaian, kesimpulan |
| `'tense'` | Konflik, perdebatan, keputusan sulit | Argumen antar karakter, dilema moral, klimaks |
| `'menu'` | Hanya untuk main menu | Main menu screen |

#### Step 2: Edit Chapter Data

Buka file chapter yang sesuai (e.g., `data/chapter-2.ts`):

```typescript
// SEBELUM: Scene tanpa audio
ch2_conflict: {
  id: "ch2_conflict",
  backgroundImage: BG_BALAI_DESA,
  characterImage: CHAR_BAYU,
  characterName: "Bayu",
  text: "(Menggebrak meja) Ini tidak adil!",
  nextSceneId: "ch2_response",
},

// SESUDAH: Scene dengan background music
ch2_conflict: {
  id: "ch2_conflict",
  backgroundImage: BG_BALAI_DESA,
  characterImage: CHAR_BAYU,
  characterName: "Bayu",
  text: "(Menggebrak meja) Ini tidak adil!",
  nextSceneId: "ch2_response",
  backgroundMusic: "tense",  // ✅ TAMBAHKAN BARIS INI
},
```

#### Step 3: Test

1. Jalankan `npm run dev`
2. Navigate ke scene yang sudah diupdate
3. Music seharusnya autoplay dengan mood yang tepat
4. Saat pindah ke scene lain dengan mood berbeda, music akan fade smooth

---

### Skenario 2: Menambahkan Narrator Audio ke Scene Intro/Conclusion

Narrator biasanya digunakan untuk:
- **Scene Intro** - Pembukaan chapter dengan narasi konteks
- **Scene Conclusion** - Penutup chapter dengan narasi kesimpulan

#### Step 1: Siapkan File Audio

##### Format & Spesifikasi Audio yang Direkomendasikan:
```
Format:       MP3
Sample Rate:  44.1 kHz
Bitrate:      192 kbps (untuk narasi voiceover)
Channels:     Stereo atau Mono
Loudness:     -16 LUFS (akan di-normalize oleh script)
```

##### Konvensi Penamaan File:
```
narrator-ch[CHAPTER_NUMBER]-[TYPE].mp3

Contoh:
✅ narrator-ch1-intro.mp3
✅ narrator-ch1-conclusion.mp3
✅ narrator-ch6-intro.mp3
❌ narasi cp1 #1.mp3          (format lama, tidak disarankan)
❌ narrator_chapter_1.mp3     (gunakan dash, bukan underscore)
```

#### Step 2: Normalize Audio

**Mengapa Normalization Penting?**
- Memastikan volume konsisten antar file
- Mencegah narrator terlalu keras/pelan dibanding background music
- Meningkatkan pengalaman user

**Cara 1: Gunakan Script Otomatis (Direkomendasikan)**
```powershell
# Normalize semua file sekaligus
.\normalize-audio.ps1 -Backup

# Preview dulu tanpa ubah file
.\normalize-audio.ps1 -DryRun
```

**Cara 2: Normalize Manual dengan ffmpeg**
```bash
# Target: -16 LUFS untuk narrator
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -b:a 192k output.mp3
```

#### Step 3: Letakkan File di Folder Audio
```bash
# Copy file ke folder public/audio/
cp narrator-ch6-intro.mp3 public/audio/
```

#### Step 4: Update Chapter Data

```typescript
ch6_intro: {
  id: "ch6_intro",
  backgroundImage: BG_INTRO,
  characterImage: "",  // Kosong untuk narrator
  characterName: "Narasi",  // Gunakan "Narasi" untuk narrator
  text: "Pagi itu, desa Amanah menghadapi tantangan baru...",
  nextSceneId: "ch6_scene_1",
  backgroundMusic: "calm",                      // Background music
  narratorAudio: "narrator-ch6-intro.mp3",      // Narrator voiceover
},
```

#### Step 5: Verifikasi dengan Script
```powershell
# Cek apakah file sudah terdaftar dengan benar
.\verify-audio.ps1

# Cek detail termasuk loudness level
.\verify-audio.ps1 -Detailed
```

---

### Skenario 3: Menambahkan Background Music Baru (Mood Baru)

Jika Anda ingin menambahkan mood baru selain `calm`, `tense`, dan `menu`:

#### Step 1: Tambahkan File Audio
```bash
# Contoh: Menambahkan mood "dramatic"
public/audio/bg-dramatic.mp3
```

#### Step 2: Update Type Definitions

Edit `lib/audioManager.ts`:

```typescript
// SEBELUM:
type BackgroundMood = 'menu' | 'calm' | 'tense';

// SESUDAH:
type BackgroundMood = 'menu' | 'calm' | 'tense' | 'dramatic';
```

#### Step 3: Update BG_MUSIC_MAP

Masih di `lib/audioManager.ts`:

```typescript
private readonly BG_MUSIC_MAP: Record<BackgroundMood, string> = {
  menu: '/audio/bg-menu.mp3',
  calm: '/audio/bg-calm.mp3',
  tense: '/audio/bg-tense.mp3',
  dramatic: '/audio/bg-dramatic.mp3',  // ✅ TAMBAHKAN INI
};
```

#### Step 4: Update Type di Chapter Data

Edit `types/chapter-data.ts`:

```typescript
export type ChapterData = {
  // ... fields lainnya
  backgroundMusic?: 'calm' | 'tense' | 'dramatic';  // ✅ Tambahkan 'dramatic'
  // ... fields lainnya
};
```

#### Step 5: Gunakan di Chapter Data

Sekarang Anda bisa menggunakan mood baru:

```typescript
ch6_climax: {
  id: "ch6_climax",
  // ... fields lainnya
  backgroundMusic: "dramatic",  // ✅ Mood baru!
},
```

---

### Skenario 4: Menambahkan Multiple Narrator dalam Satu Scene

Saat ini, sistem hanya support 1 narrator per scene. Jika Anda butuh multiple narrator:

#### Opsi A: Split Menjadi Multiple Scenes (Direkomendasikan)

```typescript
// Scene 1: Narrator pertama
ch6_narration_part1: {
  id: "ch6_narration_part1",
  characterName: "Narasi",
  text: "Bagian narasi pertama...",
  nextSceneId: "ch6_narration_part2",
  narratorAudio: "narrator-ch6-part1.mp3",
},

// Scene 2: Narrator kedua (auto-continue)
ch6_narration_part2: {
  id: "ch6_narration_part2",
  characterName: "Narasi",
  text: "Bagian narasi kedua...",
  nextSceneId: "ch6_scene_1",
  narratorAudio: "narrator-ch6-part2.mp3",
},
```

#### Opsi B: Gabungkan Audio Files (Alternatif)

Gabungkan multiple audio menjadi 1 file:

```bash
# Menggunakan ffmpeg
ffmpeg -i "concat:part1.mp3|part2.mp3" -acodec copy output.mp3
```

---

### Skenario 5: Replace Background Music di Tengah Scene

Untuk mengubah background music tanpa pindah scene, Anda perlu custom implementation:

#### Step 1: Import AudioManager di Component

```typescript
import AudioManager from "@/lib/audioManager";
```

#### Step 2: Trigger Music Change dengan Event

```typescript
const handleDramaticMoment = () => {
  const audioManager = AudioManager.getInstance();
  audioManager.playBackgroundMusic('tense');  // Switch ke tense
};

// Trigger dari button atau kondisi tertentu
<button onClick={handleDramaticMoment}>
  Ungkap kebenaran
</button>
```

---

## Audio Normalization Guide

> 🎚️ **Panduan lengkap normalisasi audio untuk konsistensi volume**

### Mengapa Audio Normalization Penting?

Tanpa normalization:
- ❌ Narrator terlalu keras → user kaget
- ❌ Background music terlalu pelan → tidak terdengar
- ❌ Volume tidak konsisten antar chapter → pengalaman buruk
- ❌ Clipping/distortion pada audio tertentu

Dengan normalization:
- ✅ Volume konsisten di semua scene
- ✅ Balance sempurna antara narrator dan background music
- ✅ Tidak ada clipping atau distortion
- ✅ Pengalaman user lebih profesional

### Target Loudness Levels

| Jenis Audio | Target LUFS | Alasan |
|-------------|-------------|---------|
| **Background Music** | **-18 LUFS** | Cukup keras untuk didengar, tapi tidak mengalahkan narrator |
| **Narrator Audio** | **-16 LUFS** | Lebih keras 2dB dari BG music untuk clarity |
| **Sound Effects** (future) | **-14 LUFS** | Paling keras untuk emphasis |

**LUFS** = Loudness Units relative to Full Scale (standar industri untuk loudness)

### Cara Normalize Audio

#### Metode 1: Menggunakan Script Otomatis (Termudah)

Script `normalize-audio.ps1` sudah include two-pass loudness normalization:

```powershell
# Preview dulu (dry run)
.\normalize-audio.ps1 -DryRun

# Normalize dengan backup
.\normalize-audio.ps1 -Backup

# Normalize tanpa backup (hati-hati!)
.\normalize-audio.ps1
```

**Output yang dihasilkan:**
```
╔════════════════════════════════════════════════════════════╗
║         AUDIO NORMALIZATION SCRIPT v1.0                   ║
╚════════════════════════════════════════════════════════════╝

[1/6] Checking ffmpeg installation...
✓ ffmpeg found: ffmpeg version 6.0

[2/6] Checking audio directory...
✓ Found 13 audio files

[3/6] Creating backup...
✓ Backup created at: .\public\audio-backup

[4/6] Analyzing current audio levels...
  Analyzing: bg-menu.mp3... LUFS: -22.3
  Analyzing: bg-calm.mp3... LUFS: -19.1
  Analyzing: narrator-ch1-intro.mp3... LUFS: -14.2

  Analysis Results:
  ┌────────────────────────────────────────┬────────────┐
  │ Filename                               │ Loudness   │
  ├────────────────────────────────────────┼────────────┤
  │ bg-menu.mp3                            │ -22.3 LUFS │
  │ bg-calm.mp3                            │ -19.1 LUFS │
  │ narrator-ch1-intro.mp3                 │ -14.2 LUFS │
  └────────────────────────────────────────┴────────────┘

[5/6] Normalizing audio files...
  Processing: bg-menu.mp3 (BG Music, target: -18 LUFS)... DONE
  Processing: narrator-ch1-intro.mp3 (Narrator, target: -16 LUFS)... DONE

[6/6] Normalization complete!
✓ Done!
```

#### Metode 2: Manual dengan ffmpeg (Advanced)

**Two-Pass Loudnorm (Paling Akurat):**

```bash
# Pass 1: Analisa audio
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -

# Output akan memberikan measured values:
# {
#   "input_i" : "-22.50",
#   "input_tp" : "-0.47",
#   ...
# }

# Pass 2: Normalize dengan measured values
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=-22.50:measured_TP=-0.47:measured_LRA=7.9:measured_thresh=-33.14:offset=0.58:linear=true -ar 44100 -b:a 192k output.mp3
```

**Single-Pass Loudnorm (Lebih Cepat, Kurang Akurat):**

```bash
# Untuk narrator (-16 LUFS)
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -b:a 192k output.mp3

# Untuk background music (-18 LUFS)
ffmpeg -i input.mp3 -af loudnorm=I=-18:TP=-1.5:LRA=11 -ar 44100 -b:a 192k output.mp3
```

#### Metode 3: Menggunakan Audacity (GUI)

1. Buka file di Audacity
2. Pilih **Effect → Loudness Normalization**
3. Set:
   - **Perceived Loudness**: -16 LUFS (narrator) atau -18 LUFS (BG music)
   - **Treat mono as dual-mono**: ✅ Check
4. Click **OK**
5. **File → Export → Export as MP3**
6. Settings:
   - Bitrate: 192 kbps
   - Quality: High

### Cara Cek Loudness Existing Audio

```bash
# Menggunakan ffmpeg
ffmpeg -i your-audio.mp3 -af loudnorm=print_format=json -f null - 2>&1 | grep input_i

# Output:
# "input_i" : "-19.30",  ← Current loudness level
```

```powershell
# Atau gunakan script verify
.\verify-audio.ps1 -Detailed
```

### Best Practices

1. ✅ **Selalu backup file original sebelum normalize**
2. ✅ **Gunakan two-pass normalization untuk akurasi maksimal**
3. ✅ **Cek hasil dengan telinga** - angka bukan segalanya
4. ✅ **Normalize SEBELUM rename file** - lebih mudah tracking
5. ✅ **Simpan file raw (pre-normalize)** untuk future adjustments

---

## Automation Scripts

> 🤖 **Script PowerShell untuk mempercepat workflow audio**

### 1. `normalize-audio.ps1`

**Fungsi:** Normalize volume semua audio files ke target LUFS

**Usage:**
```powershell
# Preview tanpa ubah file
.\normalize-audio.ps1 -DryRun

# Normalize dengan backup otomatis
.\normalize-audio.ps1 -Backup

# Normalize langsung (tidak recommended!)
.\normalize-audio.ps1
```

**Requirements:**
- ffmpeg harus terinstall dan ada di PATH
- PowerShell 5.1 atau lebih baru

**Features:**
- ✅ Two-pass loudness normalization (paling akurat)
- ✅ Auto-detect jenis file (BG music vs Narrator)
- ✅ Apply target LUFS berbeda per jenis
- ✅ Backup otomatis dengan timestamp
- ✅ Detailed analysis report
- ✅ Error handling

---

### 2. `rename-audio-files.ps1`

**Fungsi:** Rename audio files dari format lama ke format baru

**Usage:**
```powershell
# Preview rename operations
.\rename-audio-files.ps1 -DryRun

# Rename dengan backup
.\rename-audio-files.ps1 -Backup

# Rename langsung
.\rename-audio-files.ps1
```

**Rename Mapping:**
```
OLD NAME                        →  NEW NAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bgsnd menu.mp3                  →  bg-menu.mp3
bgsnd kalem (selesai).mp3       →  bg-calm.mp3
bgsnd tegang (masalah).mp3      →  bg-tense.mp3
narasi cp1  #1.mp3              →  narrator-ch1-intro.mp3
narasi cp1 #2.mp3               →  narrator-ch1-conclusion.mp3
narasi cp2 #1.mp3               →  narrator-ch2-intro.mp3
... (dan seterusnya)
```

**Features:**
- ✅ Dry run mode untuk preview
- ✅ Backup otomatis
- ✅ Detect file conflicts (target sudah ada)
- ✅ Skip file yang tidak ditemukan
- ✅ Summary report lengkap

**⚠️ Note:** Chapter 4 narrator files di-skip (user handle manual)

---

### 3. `verify-audio.ps1`

**Fungsi:** Health check sistem audio - verifikasi file existence, mapping, dan properties

**Usage:**
```powershell
# Quick check
.\verify-audio.ps1

# Detailed analysis (requires ffmpeg)
.\verify-audio.ps1 -Detailed
```

**Checks Performed:**

1. ✅ **File Existence Check**
   - Cek apakah semua expected files ada
   - List missing files
   - Detect extra/unmapped files

2. ✅ **AudioManager Configuration Check**
   - Verify BG_MUSIC_MAP mapping
   - Ensure paths correct

3. ✅ **File Properties Analysis** (mode `-Detailed`)
   - Duration
   - Bitrate
   - Loudness level
   - Detect files yang terlalu pelan/keras

**Output Example:**
```
╔════════════════════════════════════════════════════════════╗
║         AUDIO VERIFICATION SCRIPT v1.0                    ║
╚════════════════════════════════════════════════════════════╝

[1/5] Checking audio directory...
✓ Audio directory found

[2/5] Verifying expected audio files...

  Background Music:
  ┌────────────────────────────────────────┬──────────┬──────────┐
  │ Filename                               │ Status   │ Size     │
  ├────────────────────────────────────────┼──────────┼──────────┤
  │ bg-menu.mp3                            │ ✓ FOUND  │ 2847.3 KB│
  │ bg-calm.mp3                            │ ✓ FOUND  │ 3124.8 KB│
  │ bg-tense.mp3                           │ ✓ FOUND  │ 2956.1 KB│
  └────────────────────────────────────────┴──────────┴──────────┘

  Narrator Audio:
  ┌────────────────────────────────────────┬──────────┬──────────┐
  │ narrator-ch1-intro.mp3                 │ ✓ FOUND  │ 845.2 KB │
  │ narrator-ch1-conclusion.mp3            │ ✗ MISSING│          │
  └────────────────────────────────────────┴──────────┴──────────┘

[3/5] Checking for extra/unmapped files...
  Found 2 unmapped file(s):
    • narasi cp4 #3.mp3 (1024.5 KB)
    • narasi cp4 #4.mp3 (987.3 KB)

[4/5] Verifying audioManager.ts configuration...
  ✓ BG_MUSIC_MAP configuration correct

╔════════════════════════════════════════════════════════════╗
║                    HEALTH REPORT                           ║
╠════════════════════════════════════════════════════════════╣
║  Total expected files: 13                                  ║
║  Files found: 12                                           ║
║  Files missing: 1                                          ║
║  Extra/Unmapped files: 2                                   ║
║  Total issues: 3                                           ║
╚════════════════════════════════════════════════════════════╝

⚠️ ISSUES DETECTED:
  ❌ Missing: narrator-ch1-conclusion.mp3
  ⚠️ Unmapped file: narasi cp4 #3.mp3
  ⚠️ Unmapped file: narasi cp4 #4.mp3

💡 RECOMMENDATIONS:
  1. Jalankan 'rename-audio-files.ps1' untuk rename file yang salah nama
  2. Tambahkan file yang missing ke folder public/audio/
```

**Exit Codes:**
- `0` = Semua OK
- `1` = Ada missing files

---

### Workflow Lengkap dengan Scripts

```powershell
# Step 1: Letakkan semua audio files di public/audio/
# (gunakan nama apapun dulu, akan di-rename)

# Step 2: Verify audio files yang ada
.\verify-audio.ps1
# Output: List missing files dan files yang perlu di-rename

# Step 3: Rename files ke format yang benar
.\rename-audio-files.ps1 -DryRun   # Preview dulu
.\rename-audio-files.ps1 -Backup   # Execute dengan backup

# Step 4: Normalize volume semua files
.\normalize-audio.ps1 -DryRun      # Preview levels
.\normalize-audio.ps1 -Backup      # Execute normalization

# Step 5: Final verification
.\verify-audio.ps1 -Detailed
# Output: Health report lengkap dengan loudness analysis

# Step 6: Test di browser
npm run dev
```

---

## Troubleshooting

> 🔧 **Solusi untuk masalah umum dalam sistem audio**

### Flowchart: Diagnosis Audio Problems

```
Audio Tidak Terdengar?
         │
         ├─→ Cek browser console
         │   └─→ 404 error?
         │       ├─→ YES → File tidak ditemukan
         │       │         └─→ Jalankan: .\verify-audio.ps1
         │       │             └─→ Rename atau tambahkan file yang missing
         │       └─→ NO  → Lanjut ke bawah
         │
         ├─→ Cek browser autoplay policy
         │   └─→ Klik/touch halaman dulu
         │       └─→ Modern browser perlu user interaction
         │
         ├─→ Cek mute status
         │   └─→ Browser console:
         │       localStorage.getItem('bgMusicMuted')
         │       localStorage.getItem('narratorMuted')
         │       └─→ Jika 'true' → unmute atau clear localStorage
         │
         └─→ Cek volume level
             └─→ File terlalu pelan?
                 └─→ Jalankan: .\normalize-audio.ps1 -Backup
```

---

### Audio tidak playing

**Problem:** Audio tidak terdengar saat game start.

**Possible Causes:**
1. **Browser autoplay policy** - Modern browsers block autoplay hingga user interaction
2. **File path salah** - Check console untuk 404 errors
3. **Volume muted** - Check localStorage: `bgMusicMuted` atau `narratorMuted`

**Solutions:**
```typescript
// Check browser console:
const audioManager = AudioManager.getInstance();
console.log('BG Music playing?', audioManager.isBgMusicPlaying());
console.log('Narrator playing?', audioManager.isNarratorPlaying());
console.log('BG Muted?', audioManager.isBgMuted());

// Force unmute:
localStorage.removeItem('bgMusicMuted');
localStorage.removeItem('narratorMuted');
```

### Narrator tidak berhenti saat pindah scene

**Problem:** Narrator terus playing padahal sudah pindah scene.

**Solution:**
Check GameScreen.tsx audio effect:
```typescript
if (currentScene.narratorAudio) {
  audioManager.playNarrator(currentScene.narratorAudio);
} else {
  audioManager.stopNarrator();  // ← Make sure this exists
}
```

### Music tidak fade smooth

**Problem:** Music terputus mendadak tanpa fade.

**Solution:**
Increase fade duration di audioManager.ts:
```typescript
// stopBackgroundMusic():
this.bgMusic.fade(this.bgMusic.volume(), 0, 1000);  // ← Increase to 1500 or 2000
```

### Memory leak / Audio stack up

**Problem:** Multiple audio instances playing simultaneously.

**Solution:**
Ensure proper cleanup:
```typescript
// GameScreen.tsx useEffect cleanup:
return () => {
  if (showEnding) {
    AudioManager.getInstance().cleanup();
  }
};
```

### AudioControls tidak muncul

**Problem:** Floating audio controls tidak visible.

**Solution:**
1. Check z-index conflicts (should be `z-50`)
2. Check if GameScreen renders `<AudioControls />`
3. Hover bottom-right corner (might be auto-hidden)

---

### File Audio 404 Not Found

**Problem:** Console error: `GET /audio/narrator-ch1-intro.mp3 404 (Not Found)`

**Diagnosis:**
```powershell
# Cek apakah file benar-benar ada
.\verify-audio.ps1
```

**Possible Causes:**

1. **Nama file salah** - File masih pakai nama lama (narasi cp1 #1.mp3)
   ```powershell
   # Solution: Rename files
   .\rename-audio-files.ps1 -Backup
   ```

2. **File belum ditambahkan** ke `public/audio/`
   ```bash
   # Solution: Copy file ke folder yang benar
   cp your-audio.mp3 public/audio/narrator-ch1-intro.mp3
   ```

3. **Typo di chapter data** - Nama file di code beda dengan di folder
   ```typescript
   // Salah:
   narratorAudio: "narrator-ch1-intr.mp3"  // ❌ Typo: "intr"
   
   // Benar:
   narratorAudio: "narrator-ch1-intro.mp3"  // ✅
   ```

---

### Audio Terlalu Pelan atau Terlalu Keras

**Problem:** Volume tidak konsisten antar audio files.

**Diagnosis:**
```powershell
# Cek loudness levels semua files
.\verify-audio.ps1 -Detailed
```

**Output akan menunjukkan:**
```
Audio Properties:
┌─────────────────────────────────┬──────────┬─────────┬──────────┐
│ Filename                        │ Duration │ Bitrate │ Loudness │
├─────────────────────────────────┼──────────┼─────────┼──────────┤
│ bg-menu.mp3                     │ 120.5s   │ 192k    │ -22.3dB  │ ⚠️ Terlalu pelan
│ narrator-ch1-intro.mp3          │ 15.2s    │ 192k    │ -10.1dB  │ ⚠️ Terlalu keras
└─────────────────────────────────┴──────────┴─────────┴──────────┘
```

**Solution:**
```powershell
# Normalize semua audio ke level optimal
.\normalize-audio.ps1 -Backup
```

**Target Levels:**
- Background Music: **-18 LUFS** (lebih pelan)
- Narrator: **-16 LUFS** (lebih keras untuk clarity)

---

### Background Music Overlap (Multiple Playing)

**Problem:** Dua atau lebih background music playing bersamaan.

**Cause:** AudioManager tidak properly cleanup instance lama.

**Diagnosis:**
```javascript
// Buka browser console dan jalankan:
const audioManager = AudioManager.getInstance();
console.log('BG Music playing?', audioManager.isBgMusicPlaying());
console.log('Narrator playing?', audioManager.isNarratorPlaying());
```

**Solution:**

Cek di `lib/audioManager.ts` - method `playBackgroundMusic()`:

```typescript
public playBackgroundMusic(mood: BackgroundMood): void {
  // ✅ PASTIKAN ada logic stop previous music
  if (this.bgMusic) {
    this.bgMusic.fade(this.bgMusic.volume(), 0, 500);
    setTimeout(() => {
      this.bgMusic?.stop();
      this.bgMusic?.unload();  // ← IMPORTANT: unload untuk cleanup memory
      this.bgMusic = null;
    }, 500);
  }
  
  // ... create new music instance
}
```

---

### Narrator Tidak Berhenti Saat Pindah Scene

**Problem:** Narrator terus playing ke scene berikutnya.

**Cause:** Scene berikutnya tidak explicitly stop narrator.

**Solution:**

Cek `components/GameScreen.tsx` - audio effect:

```typescript
useEffect(() => {
  const audioManager = AudioManager.getInstance();
  
  if (currentScene.narratorAudio) {
    audioManager.playNarrator(currentScene.narratorAudio);
  } else {
    audioManager.stopNarrator();  // ✅ PASTIKAN baris ini ada
  }
}, [currentSceneId, currentScene]);
```

**Alternative:** Explicitly stop narrator di scene tertentu:

```typescript
// Di chapter data - scene setelah narrator
ch1_scene_after_narrator: {
  id: "ch1_scene_after_narrator",
  // ... fields lainnya
  // Tidak ada narratorAudio field → auto stop
},
```

---

### Browser Autoplay Policy Blocking Audio

**Problem:** Audio tidak autoplay di browser tertentu (terutama Safari mobile).

**Error di Console:**
```
NotAllowedError: play() failed because the user didn't interact with the document first.
```

**Explanation:**

Modern browsers (Chrome 66+, Safari 11+) block autoplay untuk:
- Mencegah spam audio ads
- Save bandwidth
- Improve user experience

**Browsers yang ketat:**
- Safari (Desktop & Mobile) - paling ketat
- Chrome Mobile - sedang
- Firefox Desktop - paling permisif

**Solutions:**

**Solution 1: Gunakan User Gesture** (Recommended)

Di `components/MainMenu.tsx`:

```typescript
const [audioStarted, setAudioStarted] = useState(false);

const handleStartGame = () => {
  // Play audio INSIDE user interaction handler
  if (!audioStarted) {
    const audioManager = AudioManager.getInstance();
    audioManager.playBackgroundMusic('menu');
    setAudioStarted(true);
  }
  
  onStartChapter(chapterId);
};
```

**Solution 2: Add "Click to Start" Splash Screen**

```typescript
const [showSplash, setShowSplash] = useState(true);

const handleStartAudio = () => {
  AudioManager.getInstance().playBackgroundMusic('menu');
  setShowSplash(false);
};

if (showSplash) {
  return (
    <div className="splash-screen" onClick={handleStartAudio}>
      <h1>Klik untuk Mulai</h1>
      <p>🔊 Audio akan diaktifkan</p>
    </div>
  );
}
```

**Solution 3: Fallback untuk Autoplay Failure**

```typescript
// Di lib/audioManager.ts
public playBackgroundMusic(mood: BackgroundMood): void {
  this.bgMusic = new Howl({
    src: [this.BG_MUSIC_MAP[mood]],
    loop: true,
    volume: this.bgMuted ? 0 : this.bgVolume,
    html5: true,
    onplayerror: () => {
      // Retry on first user interaction
      console.warn('Autoplay blocked. Waiting for user interaction...');
      
      const retry = () => {
        this.bgMusic?.play();
        document.removeEventListener('click', retry);
        document.removeEventListener('touchstart', retry);
      };
      
      document.addEventListener('click', retry);
      document.addEventListener('touchstart', retry);
    },
  });
  
  this.bgMusic.play();
}
```

---

### Memory Leak - Audio Files Tidak Di-Unload

**Problem:** Setelah bermain lama, performance menurun / memory usage tinggi.

**Diagnosis:**

Chrome DevTools:
1. Buka **DevTools** → **Performance** tab
2. Record session sambil navigate antar scenes
3. Check memory graph - apakah terus naik?

**Cause:** Audio instances tidak di-cleanup properly.

**Solution:**

**1. Ensure cleanup di GameScreen:**

```typescript
// GameScreen.tsx
useEffect(() => {
  const audioManager = AudioManager.getInstance();
  
  // ... play audio logic
  
  return () => {
    if (showEnding) {
      audioManager.cleanup();  // ✅ Cleanup saat exit game
    }
  };
}, [currentSceneId, currentScene, showEnding]);
```

**2. Verify unload di AudioManager:**

```typescript
// lib/audioManager.ts
public stopNarrator(): void {
  if (!this.narrator) return;
  
  this.narrator.stop();
  this.narrator.unload();  // ✅ CRITICAL: Free memory
  this.narrator = null;
}

public stopBackgroundMusic(): void {
  if (!this.bgMusic) return;
  
  this.bgMusic.fade(this.bgMusic.volume(), 0, 500);
  setTimeout(() => {
    this.bgMusic?.stop();
    this.bgMusic?.unload();  // ✅ CRITICAL: Free memory
    this.bgMusic = null;
    this.currentBgMood = null;
  }, 500);
}
```

**3. Add periodic cleanup:**

```typescript
// Optional: Cleanup setiap X scenes
const [sceneCount, setSceneCount] = useState(0);

useEffect(() => {
  setSceneCount(prev => prev + 1);
  
  // Cleanup every 20 scenes
  if (sceneCount % 20 === 0) {
    const audioManager = AudioManager.getInstance();
    audioManager.cleanup();
    
    // Re-init current audio
    if (currentScene.backgroundMusic) {
      audioManager.playBackgroundMusic(currentScene.backgroundMusic);
    }
  }
}, [currentSceneId]);
```

---

### ffmpeg Tidak Ditemukan (Script Error)

**Problem:** Saat menjalankan `normalize-audio.ps1` atau `verify-audio.ps1 -Detailed`:

```
✗ ERROR: ffmpeg tidak ditemukan!
  Install ffmpeg terlebih dahulu: https://ffmpeg.org/download.html
```

**Solution:**

**Windows:**

1. Download ffmpeg:
   - https://www.gyan.dev/ffmpeg/builds/
   - Download: **ffmpeg-release-essentials.zip**

2. Extract ke folder (contoh: `C:\ffmpeg`)

3. Tambahkan ke PATH:
   ```powershell
   # Buka PowerShell as Administrator
   $env:PATH += ";C:\ffmpeg\bin"
   
   # Permanent (gunakan setx):
   setx PATH "$env:PATH;C:\ffmpeg\bin" /M
   ```

4. Verify:
   ```powershell
   ffmpeg -version
   # Should output: ffmpeg version ...
   ```

**MacOS:**

```bash
# Menggunakan Homebrew
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install ffmpeg
```

**Verify Installation:**

```bash
ffmpeg -version
ffprobe -version
```

---

### TypeScript Error: Property 'backgroundMusic' does not exist

**Problem:**

```
Error: Property 'backgroundMusic' does not exist on type 'ChapterData'
```

**Cause:** Type definitions belum updated.

**Solution:**

Edit `types/chapter-data.ts`:

```typescript
export type ChapterData = {
  id: string;
  backgroundImage?: string;
  characterImage?: string;
  characterName: string;
  text: string;
  nextSceneId?: string;
  choices?: Choice[];
  backgroundMusic?: 'calm' | 'tense';  // ✅ TAMBAHKAN INI
  narratorAudio?: string;              // ✅ TAMBAHKAN INI
};
```

Kemudian restart dev server:

```bash
# Stop server (Ctrl+C) dan restart
npm run dev
```

---

### Audio Controls Button Tidak Berfungsi

**Problem:** Klik button replay/pause tidak ada efek.

**Diagnosis:**

Browser console - cek error:

```javascript
// Check apakah AudioManager accessible
const audioManager = AudioManager.getInstance();
console.log('Has narrator?', audioManager.hasNarrator());
console.log('Is playing?', audioManager.isNarratorPlaying());
```

**Common Causes:**

**1. Narrator belum ada:**

```typescript
// AudioControls.tsx
const handleReplay = () => {
  const audioManager = AudioManager.getInstance();
  
  // ✅ Check dulu sebelum replay
  if (audioManager.hasNarrator()) {
    audioManager.replayNarrator();
  } else {
    console.warn('No narrator to replay');
  }
};
```

**2. State tidak sync:**

```typescript
// Gunakan state untuk track playback
const [isPlaying, setIsPlaying] = useState(false);

useEffect(() => {
  const audioManager = AudioManager.getInstance();
  
  // Poll status (or use callback dari Howler)
  const interval = setInterval(() => {
    setIsPlaying(audioManager.isNarratorPlaying());
  }, 100);
  
  return () => clearInterval(interval);
}, []);
```

---

### Troubleshooting Checklist

Jika audio tidak berfungsi, ikuti checklist ini step by step:

```
☐ 1. Verify file existence
    → .\verify-audio.ps1
    
☐ 2. Check browser console untuk errors
    → F12 → Console tab
    
☐ 3. Check nama file sesuai konvensi
    → narrator-ch[X]-[intro|conclusion].mp3
    → bg-[menu|calm|tense].mp3
    
☐ 4. Verify chapter data mapping
    → backgroundMusic: 'calm' | 'tense'
    → narratorAudio: "filename.mp3"
    
☐ 5. Check mute status
    → localStorage.getItem('bgMusicMuted')
    → localStorage.getItem('narratorMuted')
    
☐ 6. Test user interaction (for autoplay)
    → Klik halaman minimal 1x
    
☐ 7. Verify AudioManager integration
    → GameScreen.tsx audio effect
    → MainMenu.tsx playBackgroundMusic call
    
☐ 8. Check loudness levels
    → .\verify-audio.ps1 -Detailed
    
☐ 9. Normalize audio jika perlu
    → .\normalize-audio.ps1 -Backup
    
☐ 10. Hard refresh browser
     → Ctrl + Shift + R (Windows/Linux)
     → Cmd + Shift + R (Mac)
```

---

## Browser Compatibility

| Browser | Supported | Notes |
|---------|-----------|-------|
| Chrome 90+ | ✅ Yes | Full support |
| Firefox 88+ | ✅ Yes | Full support |
| Safari 14+ | ✅ Yes | May require user interaction for autoplay |
| Edge 90+ | ✅ Yes | Full support |
| Mobile Chrome | ✅ Yes | Autoplay works after first touch |
| Mobile Safari | ⚠️ Partial | Requires user interaction, may have delays |

---

## FAQ (Frequently Asked Questions)

### Q: Kenapa harus normalize audio? Apa bedanya dengan adjust volume biasa?

**A:** Normalization berbeda dengan simple volume adjustment:

- **Volume Adjustment** = Scaling linear (semua bagian naik/turun sama)
  - Contoh: Naikan 10dB → semua bagian +10dB
  - Problem: Bisa menyebabkan clipping jika terlalu keras

- **Loudness Normalization** = Intelligent loudness matching
  - Menganalisa perceived loudness (LUFS)
  - Adjust dynamics untuk consistency
  - Cegah clipping dengan true peak limiting
  - Hasil: Volume terdengar sama meskipun waveform berbeda

**Contoh Praktis:**
```
File A: Dialog pelan background music keras → LUFS: -12 (keras)
File B: Dialog keras background music pelan  → LUFS: -20 (pelan)

Simple volume:
  File A +8dB → Clipping! ❌
  File B +8dB → Masih terdengar beda ❌

Normalization ke -16 LUFS:
  File A → Balanced ✅
  File B → Balanced ✅
  Terdengar sama keras, tidak ada clipping
```

---

### Q: Berapa ukuran file audio yang ideal untuk web game?

**A:** Rekomendasi berdasarkan jenis audio:

| Jenis | Duration | Bitrate | Size Estimate | Notes |
|-------|----------|---------|---------------|-------|
| **Background Music** | 2-4 menit | 192 kbps | 3-6 MB | Loop, quality penting |
| **Narrator Intro** | 10-30 detik | 192 kbps | 240-720 KB | Speech, clarity penting |
| **Short Narrator** | 5-15 detik | 128 kbps | 80-240 KB | Bisa lebih rendah |
| **Sound Effects** | 1-3 detik | 128 kbps | 16-48 KB | Very short |

**Tips Optimasi:**
```bash
# Untuk narrator (speech), 128 kbps cukup:
ffmpeg -i input.mp3 -b:a 128k -ar 44100 output.mp3

# Untuk music, gunakan 192 kbps:
ffmpeg -i input.mp3 -b:a 192k -ar 44100 output.mp3

# Untuk SFX, bisa lebih rendah:
ffmpeg -i input.mp3 -b:a 96k -ar 44100 output.mp3
```

**Total Audio Asset Budget:**
- Small game: < 20 MB total
- Medium game: 20-50 MB
- Large game: 50-100 MB

**Current Project:**
- 3 BG music × 4 MB = 12 MB
- 10 narrator × 500 KB = 5 MB
- **Total: ~17 MB** ✅ Good!

---

### Q: Kenapa menggunakan Howler.js? Kenapa tidak pakai HTML5 Audio API langsung?

**A:** Howler.js memberikan banyak keuntungan:

| Feature | HTML5 Audio | Howler.js |
|---------|-------------|-----------|
| **Cross-browser compatibility** | ⚠️ Inconsistent | ✅ Consistent |
| **Sprite support** | ❌ Manual | ✅ Built-in |
| **Volume/fade control** | ⚠️ Limited | ✅ Full control |
| **Multiple sounds** | ⚠️ Complex | ✅ Easy |
| **Mobile autoplay handling** | ❌ Manual | ✅ Automatic |
| **Codec fallback** | ❌ Manual | ✅ Automatic |
| **Memory management** | ❌ Manual | ✅ Built-in |

**Contoh - Fade di HTML5 Audio:**
```javascript
// HTML5 - Manual fade (complex!)
let volume = 1.0;
const fadeInterval = setInterval(() => {
  volume -= 0.1;
  if (volume <= 0) {
    clearInterval(fadeInterval);
    audio.pause();
  }
  audio.volume = Math.max(0, volume);
}, 100);

// Howler.js - One liner!
sound.fade(1.0, 0, 1000);
```

---

### Q: Bagaimana cara menambahkan subtitle untuk narrator?

**A:** Subtitle belum diimplementasikan, tapi berikut ini approach yang bisa digunakan:

**Approach 1: Gunakan Text Field yang Sudah Ada**

Scene dengan narrator sudah punya `text` field. Ini bisa jadi "subtitle":

```typescript
ch1_intro: {
  id: "ch1_intro",
  characterName: "Narasi",
  text: "Pagi yang riuh di Balai Desa...",  // ← Ini subtitle
  narratorAudio: "narrator-ch1-intro.mp3",
},
```

Text akan muncul dengan typing effect sambil narrator playing!

**Approach 2: Subtitle dengan Timestamps (Advanced)**

Jika butuh sync subtitle dengan audio timing:

```typescript
// types/chapter-data.ts - Tambahkan type
export type Subtitle = {
  start: number;  // milliseconds
  end: number;
  text: string;
};

export type ChapterData = {
  // ... existing fields
  subtitles?: Subtitle[];
};

// data/chapter-1.ts - Gunakan
ch1_intro: {
  id: "ch1_intro",
  characterName: "Narasi",
  text: "...",
  narratorAudio: "narrator-ch1-intro.mp3",
  subtitles: [
    { start: 0, end: 3000, text: "Pagi yang riuh..." },
    { start: 3000, end: 6000, text: "di Balai Desa Amanah..." },
  ],
},
```

Kemudian di `GameScreen.tsx`, tambahkan subtitle display component yang sync dengan narrator playback.

---

### Q: Apakah bisa menambahkan sound effects (SFX)?

**A:** Ya! Sistem sudah siap untuk SFX. Berikut cara implementasinya:

**Step 1: Extend AudioManager**

Edit `lib/audioManager.ts`:

```typescript
class AudioManager {
  // ... existing code
  
  private sfxInstances: Map<string, Howl> = new Map();
  
  /**
   * Play sound effect (one-shot)
   */
  public playSFX(sfxName: string, volume: number = 1.0): void {
    const sfx = new Howl({
      src: [`/audio/sfx/${sfxName}.mp3`],
      volume: volume,
      preload: true,
      onend: function() {
        this.unload();  // Auto cleanup
      },
    });
    
    sfx.play();
  }
}
```

**Step 2: Tambahkan SFX Files**

```bash
public/audio/sfx/
  ├── button-click.mp3
  ├── notification.mp3
  ├── door-knock.mp3
  └── paper-shuffle.mp3
```

**Step 3: Gunakan di Components**

```typescript
// Di component manapun
import AudioManager from "@/lib/audioManager";

const handleClick = () => {
  const audioManager = AudioManager.getInstance();
  audioManager.playSFX('button-click', 0.5);
  
  // ... handle click logic
};
```

**Step 4: Tambahkan SFX di Chapter Data** (Optional)

```typescript
export type ChapterData = {
  // ... existing fields
  sfx?: string;  // SFX yang auto-play saat scene muncul
};

// Gunakan:
ch3_knock: {
  id: "ch3_knock",
  text: "*TOK TOK TOK*",
  sfx: "door-knock",  // Auto-play SFX
},
```

---

### Q: Bagaimana cara test audio di production build?

**A:** Testing audio di production berbeda dengan development:

**Development:**
```bash
npm run dev
# Audio di-load dari public/ folder (fast, no caching)
```

**Production:**
```bash
# Build production
npm run build

# Serve production build
npm start

# Test di http://localhost:3000
```

**Perbedaan Production vs Development:**

| Aspect | Development | Production |
|--------|-------------|------------|
| **Caching** | No cache | Browser cache aktif |
| **Compression** | None | Gzip/Brotli |
| **Preload** | Slower | Faster (optimized) |
| **Autoplay** | Lebih permisif | Lebih strict |

**Production Testing Checklist:**
```
☐ Test di browser berbeda (Chrome, Firefox, Safari)
☐ Test di mobile (especially Safari iOS)
☐ Test dengan slow 3G network (Chrome DevTools)
☐ Test autoplay setelah cache clear
☐ Test setelah hard refresh (Ctrl+Shift+R)
☐ Monitor console untuk errors
☐ Check Network tab untuk failed audio loads
```

---

### Q: Bagaimana cara debug audio yang tidak playing?

**A:** Gunakan debugging script di browser console:

**Debug Script:**
```javascript
// Copy-paste di browser console

// Get AudioManager instance
const audioManager = AudioManager.getInstance();

// Check status
console.log('=== AUDIO SYSTEM DEBUG ===');
console.log('BG Music Playing:', audioManager.isBgMusicPlaying());
console.log('BG Music Muted:', audioManager.isBgMuted());
console.log('Narrator Playing:', audioManager.isNarratorPlaying());
console.log('Narrator Exists:', audioManager.hasNarrator());
console.log('Narrator Muted:', audioManager.isNarratorMuted());

// Check localStorage
console.log('\n=== LOCALSTORAGE ===');
console.log('BG Muted:', localStorage.getItem('bgMusicMuted'));
console.log('Narrator Muted:', localStorage.getItem('narratorMuted'));

// Force unmute
localStorage.removeItem('bgMusicMuted');
localStorage.removeItem('narratorMuted');
console.log('✓ Mute preferences cleared');

// Test playback
console.log('\n=== TEST PLAYBACK ===');
audioManager.playBackgroundMusic('menu');
console.log('✓ Attempted to play menu music');

setTimeout(() => {
  console.log('After 1s - Playing:', audioManager.isBgMusicPlaying());
}, 1000);
```

**Expected Output (jika OK):**
```
=== AUDIO SYSTEM DEBUG ===
BG Music Playing: true
BG Music Muted: false
Narrator Playing: false
Narrator Exists: false
Narrator Muted: false

=== LOCALSTORAGE ===
BG Muted: null
Narrator Muted: null

=== TEST PLAYBACK ===
✓ Attempted to play menu music
After 1s - Playing: true
```

---

### Q: Apakah audio akan berfungsi di browser offline (PWA)?

**A:** Ya, tapi perlu konfigurasi service worker:

**Current:** Audio tidak cached → Butuh internet

**Solution untuk Offline Support:**

**1. Update `next.config.ts` untuk PWA:**

```bash
npm install next-pwa
```

```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.mp3$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'audio-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
});

module.exports = withPWA({
  // ... existing config
});
```

**2. Test Offline:**
```bash
npm run build
npm start

# Di browser:
# 1. Buka game
# 2. Play semua audio (untuk cache)
# 3. DevTools → Network → Offline
# 4. Refresh → Audio masih playing!
```

---

### Q: Bagaimana cara mengurangi ukuran file audio tanpa mengurangi quality?

**A:** Beberapa teknik compression:

**1. Optimize MP3 Encoding:**
```bash
# Variable Bitrate (VBR) - quality based
ffmpeg -i input.mp3 -codec:a libmp3lame -q:a 2 output.mp3
# q:a 0-9 (0=best, 9=worst)
# q:a 2 ≈ 190 kbps average (good quality)

# Untuk narrator (speech), bisa lebih rendah:
ffmpeg -i input.mp3 -codec:a libmp3lame -q:a 4 output.mp3
# q:a 4 ≈ 165 kbps (still good untuk voice)
```

**2. Gunakan Opus (Superior Compression):**
```bash
# Opus codec - better quality per bitrate
ffmpeg -i input.mp3 -c:a libopus -b:a 96k output.opus

# Tapi perlu fallback untuk browser lama
```

**3. Stereo → Mono untuk Narrator:**
```bash
# Narrator tidak perlu stereo
ffmpeg -i input.mp3 -ac 1 -b:a 128k output.mp3
# -ac 1 = mono channel
# Reduce size ~50%!
```

**4. Remove Silence:**
```bash
# Trim silence di awal/akhir
ffmpeg -i input.mp3 -af silenceremove=start_periods=1:start_duration=0.1:start_threshold=-50dB output.mp3
```

**Comparison:**

| Method | Original | After | Savings | Quality |
|--------|----------|-------|---------|---------|
| VBR q:a 2 | 2.4 MB | 1.9 MB | 21% | ✅ Excellent |
| VBR q:a 4 | 2.4 MB | 1.6 MB | 33% | ✅ Good |
| Mono | 2.4 MB | 1.2 MB | 50% | ✅ Good (voice) |
| Opus 96k | 2.4 MB | 0.9 MB | 63% | ✅ Excellent |

---

## Performance Tips

1. **Use HTML5 mode** untuk long audio files (sudah implemented)
2. **Preload audio** untuk critical files (intro music)
3. **Unload unused audio** dengan `audioManager.cleanup()`
4. **Limit concurrent sounds** (max 1 BG + 1 narrator)
5. **Use appropriate bitrate** (128kbps untuk speech, 192kbps untuk music)

---

## Future Enhancements

- [ ] Volume sliders in AudioControls UI
- [ ] Audio visualization (waveform atau spectrum)
- [ ] Multiple narrator tracks per scene
- [ ] Sound effects (SFX) system
- [ ] Playlist system untuk background music
- [ ] Audio preloader dengan progress bar
- [ ] Accessibility: Subtitle system untuk narrator
- [ ] Audio settings modal (advanced controls)

---

## Credits

- **Audio Library:** [Howler.js](https://howlerjs.com/) by James Simpson
  - License: MIT
  - Version: 2.2.4
  - GitHub: https://github.com/goldfire/howler.js

- **Audio Processing:** [FFmpeg](https://ffmpeg.org/)
  - License: LGPL/GPL
  - Digunakan untuk normalization dan conversion

- **Implementation & Documentation:** OpenCode Agent
  - Audio system architecture
  - PowerShell automation scripts
  - Comprehensive documentation

- **Game Development:** Suara Yang Didengar Team
  - Game design & narrative
  - Audio content creation
  - User experience testing

---

## Kontribusi & Support

### Melaporkan Bug

Jika menemukan bug atau issue dengan audio system:

1. **Cek Troubleshooting section** - mungkin sudah ada solusinya
2. **Jalankan diagnostic script:**
   ```powershell
   .\verify-audio.ps1 -Detailed
   ```
3. **Buka issue** di GitHub repository dengan informasi:
   - Browser & version
   - Operating system
   - Error message (screenshot console)
   - Diagnostic script output
   - Steps to reproduce

### Berkontribusi

Contributions welcome! Area yang bisa dikontribusi:

- 🎵 **Audio Content:** Narrator recordings, background music
- 🔧 **Code Improvements:** Bug fixes, performance optimization
- 📚 **Documentation:** Translations, examples, tutorials
- 🧪 **Testing:** Browser testing, mobile testing, edge cases
- ✨ **Features:** Subtitle system, audio visualization, SFX system

---

## Changelog

### Version 1.0.0 (April 3, 2026)

**Initial Release**
- ✅ AudioManager singleton implementation
- ✅ Background music system (3 moods)
- ✅ Narrator audio system dengan autoplay
- ✅ AudioControls UI component
- ✅ Automatic audio switching berdasarkan scene
- ✅ Mute/unmute dengan localStorage persistence
- ✅ Smooth fade in/out transitions
- ✅ Memory management & cleanup

**Scripts & Tools**
- ✅ `normalize-audio.ps1` - Audio normalization script
- ✅ `rename-audio-files.ps1` - Batch rename utility
- ✅ `verify-audio.ps1` - Health check & diagnostics

**Documentation**
- ✅ Comprehensive AUDIO_SYSTEM.md
- ✅ API reference
- ✅ Usage guide dengan examples
- ✅ Troubleshooting guide
- ✅ FAQ section

---

## License

Lihat [LICENSE](../LICENSE) file untuk detail.

**Audio System Code:** Sama dengan project license

**Howler.js Library:** MIT License - Copyright (c) 2013-2024 James Simpson

**Audio Content:** Copyright © Suara Yang Didengar Team

---

## Appendix

### A. File Naming Convention Reference

**Background Music:**
```
Pattern: bg-[mood].mp3

Examples:
✅ bg-menu.mp3
✅ bg-calm.mp3
✅ bg-tense.mp3
✅ bg-dramatic.mp3

❌ bgsnd menu.mp3          (old format)
❌ bg_menu.mp3             (use dash, not underscore)
❌ background-menu.mp3     (too long, use 'bg')
```

**Narrator Audio:**
```
Pattern: narrator-ch[NUMBER]-[TYPE].mp3

Examples:
✅ narrator-ch1-intro.mp3
✅ narrator-ch1-conclusion.mp3
✅ narrator-ch6-intro.mp3

❌ narasi cp1 #1.mp3       (old format)
❌ narrator_ch1_intro.mp3  (use dash, not underscore)
❌ ch1-narrator-intro.mp3  (wrong order)
```

**Sound Effects (jika ditambahkan):**
```
Pattern: sfx-[name].mp3

Examples:
✅ sfx-button-click.mp3
✅ sfx-door-knock.mp3
✅ sfx-notification.mp3

❌ sound-effect-button.mp3 (too long)
❌ click.mp3               (not specific enough)
```

---

### B. Audio Specifications Table

| Aspect | Background Music | Narrator | Sound Effects |
|--------|-----------------|----------|---------------|
| **Format** | MP3 | MP3 | MP3 |
| **Bitrate** | 192 kbps | 128-192 kbps | 96-128 kbps |
| **Sample Rate** | 44.1 kHz | 44.1 kHz | 44.1 kHz |
| **Channels** | Stereo | Mono/Stereo | Mono |
| **Loudness** | -18 LUFS | -16 LUFS | -14 LUFS |
| **Duration** | 2-4 min (loop) | 10-30 sec | 1-3 sec |
| **File Size** | 3-6 MB | 200-700 KB | 15-50 KB |
| **Loop** | Yes | No | No |
| **Preload** | Yes | Yes | Optional |

---

### C. Keyboard Shortcuts Reference

Untuk AudioControls UI (bisa ditambahkan):

| Key | Action |
|-----|--------|
| `Space` | Play/Pause narrator |
| `R` | Replay narrator |
| `M` | Mute/Unmute background music |
| `N` | Mute/Unmute narrator |
| `↑` | Volume up |
| `↓` | Volume down |

**Implementation Example:**
```typescript
// components/AudioControls.tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    const audioManager = AudioManager.getInstance();
    
    switch(e.key.toLowerCase()) {
      case ' ':
        if (audioManager.isNarratorPlaying()) {
          audioManager.pauseNarrator();
        } else {
          audioManager.resumeNarrator();
        }
        break;
      case 'r':
        audioManager.replayNarrator();
        break;
      case 'm':
        audioManager.toggleBgMute();
        break;
      // ... etc
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

### D. Browser Console Commands Reference

Useful commands untuk debugging di browser console:

```javascript
// Get AudioManager
const am = AudioManager.getInstance();

// Status checks
am.isBgMusicPlaying()      // Check BG music
am.isNarratorPlaying()     // Check narrator
am.hasNarrator()           // Check if narrator loaded

// Playback control
am.playBackgroundMusic('calm')     // Play calm music
am.playBackgroundMusic('tense')    // Switch to tense
am.playNarrator('narrator-ch1-intro.mp3')  // Play narrator

// Stop/pause
am.stopNarrator()
am.pauseNarrator()
am.resumeNarrator()
am.replayNarrator()

// Volume control
am.setBgVolume(0.3)        // Set BG to 30%
am.setNarratorVolume(0.8)  // Set narrator to 80%

// Mute control
am.toggleBgMute()          // Toggle BG mute
am.toggleNarratorMute()    // Toggle narrator mute

// Full cleanup
am.cleanup()               // Stop & unload all audio

// Check localStorage
localStorage.getItem('bgMusicMuted')
localStorage.getItem('narratorMuted')

// Clear localStorage
localStorage.removeItem('bgMusicMuted')
localStorage.removeItem('narratorMuted')
```

---

### E. FFmpeg Command Reference

**Normalize Audio:**
```bash
# Two-pass loudnorm (most accurate)
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
# Use output values in second pass:
ffmpeg -i input.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=-22.5:measured_TP=-0.5:measured_LRA=7.8:measured_thresh=-33.1:offset=0.5 -ar 44100 -b:a 192k output.mp3
```

**Convert Format:**
```bash
# WAV to MP3
ffmpeg -i input.wav -codec:a libmp3lame -b:a 192k output.mp3

# M4A to MP3
ffmpeg -i input.m4a -codec:a libmp3lame -b:a 192k output.mp3

# Any format to MP3
ffmpeg -i input.* -codec:a libmp3lame -b:a 192k output.mp3
```

**Batch Processing:**
```bash
# PowerShell - Convert all WAV to MP3
Get-ChildItem *.wav | ForEach-Object {
  $output = $_.BaseName + ".mp3"
  ffmpeg -i $_.Name -codec:a libmp3lame -b:a 192k $output
}
```

**Trim Audio:**
```bash
# Trim first 5 seconds
ffmpeg -i input.mp3 -ss 5 output.mp3

# Trim to specific duration (30 seconds)
ffmpeg -i input.mp3 -t 30 output.mp3

# Trim from 5s to 35s (30 seconds total)
ffmpeg -i input.mp3 -ss 5 -t 30 output.mp3
```

**Merge Audio:**
```bash
# Concatenate multiple files
echo file 'part1.mp3' > filelist.txt
echo file 'part2.mp3' >> filelist.txt
ffmpeg -f concat -i filelist.txt -c copy output.mp3
```

**Extract Audio from Video:**
```bash
# Extract audio from MP4
ffmpeg -i video.mp4 -q:a 0 -map a output.mp3
```

---

### F. Quick Reference Card

**📁 File Locations**
```
public/audio/               ← Audio files
lib/audioManager.ts         ← Audio logic
components/GameScreen.tsx   ← Audio integration
components/AudioControls.tsx ← UI controls
data/chapter-*.ts           ← Audio mappings
```

**🎵 Add Background Music**
```typescript
sceneName: {
  // ...
  backgroundMusic: "calm",  // or "tense"
}
```

**🎤 Add Narrator**
```typescript
sceneName: {
  // ...
  narratorAudio: "narrator-ch1-intro.mp3",
}
```

**🔧 Scripts**
```powershell
.\normalize-audio.ps1 -Backup    # Normalize volumes
.\rename-audio-files.ps1 -Backup # Fix naming
.\verify-audio.ps1 -Detailed     # Health check
```

**🐛 Debug**
```javascript
AudioManager.getInstance().isBgMusicPlaying()
localStorage.clear()
```

**🎯 Target Levels**
- BG Music: **-18 LUFS**
- Narrator: **-16 LUFS**
- Bitrate: **192 kbps**

---

**Last Updated:** April 3, 2026  
**Version:** 1.0.0  
**Authors:** OpenCode Agent, Suara Yang Didengar Team

---

*Semoga dokumentasi ini membantu! Jika ada pertanyaan atau butuh bantuan, silakan open issue di GitHub repository. Happy coding! 🎵✨*
